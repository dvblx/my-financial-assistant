from requests import get
from requests.exceptions import RequestException


def convert_currency(amount, currency_from, currency_to):
    try:
        response = get("https://www.cbr-xml-daily.ru/daily_json.js")
        response_json = response.json()
        currency_from_data = response_json["Valute"][currency_from]
        currency_to_data = response_json["Valute"][currency_to]
        amount_before = amount if currency_from == "RUB" else amount * currency_from_data["Value"]
        amount_after = amount_before * currency_to_data["Value"]
        return amount_after
    except RequestException:
        return None
