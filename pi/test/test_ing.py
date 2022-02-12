def capitalize_string(s: str) -> str:
    if not isinstance(s, str):
        raise TypeError('Please provide a string')
    return s.capitalize()


def test_capitalize_string() -> None:
    assert capitalize_string('test') == 'Test'
