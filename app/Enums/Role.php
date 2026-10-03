<?php

namespace App\Enums;

enum Role: string
{
    case SUPER_ADMIN = 'SUPER_ADMIN';
    case ADMIN = 'ADMIN';
    case EDITOR = 'EDITOR';
    case AUTHOR = 'AUTHOR';
}
