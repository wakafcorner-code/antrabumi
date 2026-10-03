<?php

namespace App\Enums;

enum ContentStatus: string
{
    case DRAFT = 'DRAFT';
    case REVIEW = 'REVIEW';
    case PUBLISHED = 'PUBLISHED';
    case ARCHIVED = 'ARCHIVED';
}
