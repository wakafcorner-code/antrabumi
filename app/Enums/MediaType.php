<?php

namespace App\Enums;

enum MediaType: string
{
    case IMAGE = 'IMAGE';
    case DOCUMENT = 'DOCUMENT';
    case VIDEO = 'VIDEO';
    case AUDIO = 'AUDIO';
    case OTHER = 'OTHER';
}
