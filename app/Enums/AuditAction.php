<?php

namespace App\Enums;

enum AuditAction: string
{
    case LOGIN = 'LOGIN';
    case LOGOUT = 'LOGOUT';
    case CREATE = 'CREATE';
    case UPDATE = 'UPDATE';
    case DELETE = 'DELETE';
    case PUBLISH = 'PUBLISH';
    case UNPUBLISH = 'UNPUBLISH';
    case ARCHIVE = 'ARCHIVE';
    case UPLOAD = 'UPLOAD';
    case USER_ROLE_CHANGED = 'USER_ROLE_CHANGED';
    case SETTING_CHANGED = 'SETTING_CHANGED';
}
