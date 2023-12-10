from datetime import datetime


def filter_operations(request, queryset):
    current_date_time = datetime.now()
    one_date = request.GET.get('date')
    date_from = request.GET.get('date_from')
    date_to = request.GET.get('date_to')
    one_month = request.GET.get('month')
    month_from = request.GET.get('month_from')
    month_to = request.GET.get('month_to')
    one_year = request.GET.get('year')
    year_from = request.GET.get('year_from')
    year_to = request.GET.get('year_to')

    result = queryset

    if year_from and year_to:
        result = result.filter(conversion_date_time__year__gte=year_from,
                               conversion_date_time__year__lte=year_to)
    elif one_year:
        result = result.filter(conversion_date_time__year=one_year)
    if month_from and month_to:
        result = result.filter(conversion_date_time__year=current_date_time.year,
                               conversion_date_time__month__gte=month_from,
                               conversion_date_time__month__lte=month_to)
    elif one_month:
        result = result.filter(conversion_date_time__year=current_date_time.year,
                               conversion_date_time__month=one_month)
    if date_from and date_to:
        result = result.filter(conversion_date_time__year=current_date_time.year,
                               conversion_date_time__month=current_date_time.month,
                               conversion_date_time__day__gte=date_from,
                               conversion_date_time__day__lte=date_to)
    elif one_date:
        result = result.filter(conversion_date_time__year=current_date_time.year,
                               conversion_date_time__month=current_date_time.month,
                               conversion_date_time__day=one_date)

    return result
