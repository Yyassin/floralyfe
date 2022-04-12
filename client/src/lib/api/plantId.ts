/**
 * plantId.ts
 * 
 * Helpers to request plant recongition
 * data from Plant Id API.
 * 
 * @author Yousef
 */

/**
 * Type definitions for PlantID API.
 */
type Taxonomy = {
    class: string,
    family: string,
    genus: string,
    kingdom: string,
    order: string,
    phylum: string
}

type PlantIDImage = {
    id: string,
    similarity: number,
    url: string,
    url_small: string
}

interface PlantIDPlant {
    id: string,
    plant_name: string,
    plant_details: {
        common_names: string[],
        edible_parts: string[],
        propogation_methods: string[],
        synonyms: string[],
        taxonomy: Taxonomy,
        url: string,            // wiki link
        wiki_description: {
            value: string
        },
        wiki_image: {
            value: string
        },
        scientific_name: string,
        structured_name: {
            genus: string,
            species: string
        }
    },
    probability: number,
    confirmed: boolean,
    similar_images: PlantIDImage[]
}

/** PlantId Response Type */
interface PlantIDResponse {
    suggestions: PlantIDPlant[],
    modifiers: string[],
    secret: string,
    fail_cause: string,
    countable: boolean,
    feedback: string,
    is_plant_probability: number,
    is_plant: boolean
}

/**
 * Converts the specified image to base64.
 * @param image HTMLImageElement, the image to convert.
 * @returns string, the encoded image.
 */
const toBase64 = (image: HTMLImageElement): string | undefined => {
    if (!document) { return; } // Client side only
    const canvas = document.createElement("canvas");

    canvas.width = image.width;
    canvas.height = image.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
        throw new Error("lib::plantId::toBase64: Error getting canvas context.");
    }

    ctx.drawImage(image, 0, 0);
    const dataUrl = canvas.toDataURL("image/png");
    return dataUrl;
}

/**
 * Fetches plant identification data from the PlantID API
 * corresponding to the specified image.
 * @param encodedImage string, the image to identify.
 * @returns Promise<PlantIDResponse>, the api response.
 */
const identifyPlant = async (encodedImage: string): Promise<PlantIDResponse> => {
    const data = {
        api_key: process.env.NEXT_PUBLIC_PLANT_ID_API_KEY,
        images: [encodedImage],
        modifiers: ["crops_fast", "similar_images", "health_all", "disease_similar_images"],
        plant_language: "en",
        plant_details: [
            "common_names",
            "url",
            "name_authority",
            "wiki_description",
            "taxonomy",
            "synonyms"
        ],
        disease_details: ["common_names", "url", "description"]
    }

    const response = await fetch('https://api.plant.id/v2/identify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        // console.log('Success:', data);
        return data;
    })
    .catch((error) => {
        console.error('Error:', error);
    });

    return response;
}

export {
    toBase64,
    identifyPlant
}
