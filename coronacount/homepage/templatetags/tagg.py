from django import template

register = template.Library()

@register.filter(name='comma')
def comma(value):
    return int(value.replace(',', ''))
