<?php

namespace App\Enums;

enum MessageStatus: string
{
    case NEW = 'NEW';
    case READ = 'READ';
    case IN_PROGRESS = 'IN_PROGRESS';
    case RESOLVED = 'RESOLVED';
    case ARCHIVED = 'ARCHIVED';

    public function inboxLabel(): string
    {
        return match ($this) {
            self::NEW => 'Baru',
            self::READ => 'Dibaca',
            self::IN_PROGRESS => 'Diproses',
            self::RESOLVED => 'Selesai',
            self::ARCHIVED => 'Diarsipkan',
        };
    }

    public function detailLabel(): string
    {
        return match ($this) {
            self::NEW => 'Baru (Belum Dibaca)',
            self::READ => 'Sudah Dibaca',
            self::IN_PROGRESS => 'Sedang Diproses',
            self::RESOLVED => 'Selesai Ditindaklanjuti',
            self::ARCHIVED => 'Diarsipkan',
        };
    }

    public function inboxBadgeClasses(): string
    {
        return match ($this) {
            self::NEW => 'bg-blue-50 text-blue-700 border-blue-200',
            self::READ => 'bg-neutral-50 text-neutral-600 border-neutral-200',
            self::IN_PROGRESS => 'bg-amber-50 text-amber-800 border-amber-200',
            self::RESOLVED => 'bg-emerald-50 text-emerald-800 border-emerald-200',
            self::ARCHIVED => 'bg-neutral-100 text-neutral-400 border-neutral-200',
        };
    }
}
