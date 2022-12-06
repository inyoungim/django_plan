from .models import AccessHistory


class AccessHistoryMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # code of before response view
        if hasattr(request, 'preset'):
            if 'acc_history' in request.preset:
                del request.preset['acc_history']

        response = self.get_response(request)
        # code of after response view

        if hasattr(request, 'preset'):
            if 'acc_history' in request.preset:
                acc_history = request.preset.get('acc_history')
                # acc_type3 : Action 항목으로 Action 이 존재할때만 History 작성
                acc_type3 = acc_history.get('acc_type3', '')
                if acc_type3 != '':
                    db_data = AccessHistory()
                    db_data.menu_id = int(request.preset.get('menu_id', 0))
                    db_data.menu_name = request.preset.get('menu_name', '')[:50]
                    db_data.acc_type1 = acc_history.get('acc_type1', '')[:50]
                    db_data.acc_type2 = acc_history.get('acc_type2', '')[:50]
                    db_data.acc_type3 = acc_history.get('acc_type3', '')[:50]
                    db_data.acc_type4 = acc_history.get('acc_type4', '')[:2000]
                    db_data.acc_type5 = acc_history.get('acc_type5', '')[:500]
                    db_data.user_empno = request.preset.get('user_emp_no', '')
                    db_data.user_name = request.preset.get('user_name', '')
                    db_data.user_name_en = request.preset.get('user_name_en', '')
                    db_data.user_mail = request.preset.get('user_mail', '')
                    db_data.user_posi = request.preset.get('user_position', '')
                    db_data.user_posi_en = request.preset.get('user_position_en', '')
                    db_data.user_org = request.preset.get('user_org_name', '')
                    db_data.user_org_en = request.preset.get('user_org_name_en', '')
                    site = request.preset.get('site', 'default')
                    db_data.save(using=site)

        return response
