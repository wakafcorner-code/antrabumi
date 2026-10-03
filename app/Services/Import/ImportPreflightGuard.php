<?php

namespace App\Services\Import;

use RuntimeException;

final class ImportPreflightGuard
{
    public static function assertSourceDatabase(string $configured, string $active): void
    {
        if ($configured !== 'antrabumi' || $active !== 'antrabumi') {
            throw new RuntimeException('Source database must resolve exactly to antrabumi.');
        }
    }

    public static function assertTargetDatabase(string $configured, string $active): void
    {
        if ($configured !== 'antrabumi_laravel' || $active !== 'antrabumi_laravel') {
            throw new RuntimeException('Production target must resolve exactly to antrabumi_laravel.');
        }
    }

    public static function assertMigrationLedger(array $actual, array $expected): void
    {
        sort($actual, SORT_STRING);
        sort($expected, SORT_STRING);

        if ($actual !== $expected) {
            throw new RuntimeException('Production target migration ledger does not match the reviewed schema.');
        }
    }

    public static function assertDomainTablesEmpty(array $rowCounts): void
    {
        if (count($rowCounts) !== 30) {
            throw new RuntimeException('Exactly 30 domain tables must be checked before import.');
        }

        foreach ($rowCounts as $table => $count) {
            if ((int) $count !== 0) {
                throw new RuntimeException("Production target table {$table} is not empty.");
            }
        }
    }
}