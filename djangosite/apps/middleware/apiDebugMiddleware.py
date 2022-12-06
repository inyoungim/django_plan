from django.conf import settings
from django.utils.deprecation import MiddlewareMixin
from django.http import HttpResponse
import json
from django.db import connection, connections


class ApiDebugMiddleware(MiddlewareMixin):
    # 'debug' query parameter (e.g. http://localhost/foo?debug)

    @staticmethod
    def process_response(request, response):
        if request.GET.get('debug'):
            if response['Content-Type'] == 'application/json':
                content = json.dumps(json.loads(response.content), sort_keys=True, indent=2)
                response = HttpResponse(u'<html><body><pre>{}</pre></body></html>'.format(content))

        if '/api/' in request.path and settings.SQLDEBUG:
            indentation = 2
            print("\n\n%s\033[1;35m[SQL Queries for]\033[1;34m %s\033[0m\n" % (" " * indentation, request.path_info))
            total_time = 0.0
            for query in connections[request.preset["site"]].queries:
                nice_sql = query['sql'].replace('"', '').replace(',', ', ')
                sql = "\033[1;31m[%s]\033[0m %s" % (query['time'], nice_sql)
                total_time = total_time + float(query['time'])
                print(sql)
            replace_tuple = (" " * indentation, str(total_time))
            print("%s\033[1;32m[TOTAL TIME: %s seconds]\033[0m" % replace_tuple)
            print("%s\033[1;32m[TOTAL QUERIES: %s]\033[0m" % (" " * indentation, len(connections[request.preset["site"]].queries)))

        return response
