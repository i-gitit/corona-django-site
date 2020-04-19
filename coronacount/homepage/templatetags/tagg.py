from django import template

register = template.Library()

@register.filter(name='comma')
def comma(value):
    return int(value.replace(',', ''))


@register.filter(name='plus')
def plus(value):
    return value.replace('+', '')
