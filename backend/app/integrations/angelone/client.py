from SmartApi import SmartConnect


def get_angel_client(api_key: str) -> SmartConnect:

    return SmartConnect(api_key=api_key)