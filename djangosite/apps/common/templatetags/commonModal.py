from django import template

register = template.Library()


@register.inclusion_tag('common/commonModal.html')
def common_dialog(*args, **kwargs):
    modal_title = kwargs.get('title', 'Confirmation')
    modal_contents = kwargs.get('contents', 'Are you sure to delete?')

    return {
        'modal_title': modal_title,
        'modal_contents': modal_contents,
    }


# kr,en language translate
@register.filter
def trans(value,lang="en"):
    t_value = value.split(',')
    if len(t_value) < 2:
        return value.strip()

    if lang == "en":
        return t_value[0].strip()
    else:
        return t_value[1].strip()

