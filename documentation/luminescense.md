# Luminescence 

We used to manually calculate luminescense for images but the loops were computationally expensive (even with abstraction from numpy). Luckily, some research lead to discovering a very efficient OpenCV abstraction - but it abstracts a bit too much so I've documented the more detailed procedure here.

## The Goal

Given any image, we would like to extract a measure of the perceived light - the luminescense.

## The Procedure

### Normalization

The equation used to calculate luminescense requires that the image channels be normalized in the range of 0 to 1.

```python
normalized = np.where(True, image / 255, None)
```

### sRGB to Linear RGB Conversion

An OpenCV image is loaded as a BGR image, a slight ordering modification on the sRGB scheme. After normalizing the channels, they need to be linearized such to reverse any gamma encoding.

```python
def sRGB_to_lin(color_channel: Any) -> float:
    if (color_channel <= 0.04045):
        return color_channel / 12.92
    else:
        return pow((color_channel + 0.055) / 1.055, 2.4)
```

##### Faster
```python
linear = np.where(normalized <= 0.04045, normalized / 12.92, ((normalized + 0.055) / 1.055) ** 2.4)
```

### The Luminescense Y

Once we've linearized the sRGB channels, we can apply the following equation to calculate the luminescense of each pixel.

```python
weights = [0.0722, 0.7152, 0.2126]

# A linearized pixel (this would be in a loop over all pixels (i, j))
v = tuple(sRGB_to_lin(image.item(i, j, k) / 255) for k in range(channels))

y = np.dot(v, weights)
```

##### Faster
```python
y = np.dot(linear[..., :3], weights).flatten()
```

Y is strictly bound between 0 (dark - black) and 1 (bright - white).

### The Perceived Lightness L*
The human brain perceives light differently than simple RGB values can convey. To transform the calculated luminescense Y to a perceived lightness L*, we use the following equation.

```python
def y_to_lstar(y: Any) -> float:
    if (y <= 216 / 24389):
        return y * (24389 / 27)
    else:
        return pow(y, 1 / 3) * 116 - 16
```

##### Faster
```python
lstar = np.where(y <= 216 / 24389, y * (24389 / 27), (y ** (1 / 3)) * 116 - 16)
```

L* strictly bound between 0 (dark - black) and 100 (bright - white).
### The Final Result
Technically, the luminescense is the sum of all the L* values for the pixels in an image. We'd like a percentage so we can divide the sum by the amount of pixels * 100.

```python
return lstar.sum() / (lstar.size * 100)
```

### The Improvement 
The L* value we calculated above is actually a channel in another colouring scheme: CIEL\*A\*B\*. OpenCV conveniently has an optimized conversion method to transform BGR to CIELAB and so the calculation can be reduced to

```python
lab_image = cv.cvtColor(im1, cv.COLOR_BGR2LAB)
lstar = lab_image[:, :, 0].flatten()
lumin = lstar.sum() / (255 * (lstar.size))
```

which produces the same result (+- 1%).

## Source
https://stackoverflow.com/questions/596216/formula-to-determine-perceived-brightness-of-rgb-color/56678483#56678483