<?php

namespace Tests\Unit;

use App\Services\Import\ImportPreflightGuard;
use PHPUnit\Framework\TestCase;
use RuntimeException;

class ImportPreflightGuardTest extends TestCase
{
    public function test_accepts_only_the_exact_source_and_production_database_names(): void
    {
        ImportPreflightGuard::assertSourceDatabase('antrabumi', 'antrabumi');
        ImportPreflightGuard::assertTargetDatabase('antrabumi_laravel', 'antrabumi_laravel');

        $this->expectException(RuntimeException::class);
        ImportPreflightGuard::assertSourceDatabase('antrabumi_laravel', 'antrabumi');
    }

    public function test_rejects_wrong_configured_or_active_production_target(): void
    {
        try {
            ImportPreflightGuard::assertTargetDatabase('antrabumi_migration_test_2', 'antrabumi_laravel');
            $this->fail('A non-production configured target must be rejected.');
        } catch (RuntimeException) {
            $this->assertTrue(true);
        }

        $this->expectException(RuntimeException::class);
        ImportPreflightGuard::assertTargetDatabase('antrabumi_laravel', 'antrabumi_migration_test_2');
    }

    public function test_requires_the_exact_migration_ledger(): void
    {
        $expected = ['migration-a', 'migration-b'];
        ImportPreflightGuard::assertMigrationLedger(['migration-b', 'migration-a'], $expected);

        $this->expectException(RuntimeException::class);
        ImportPreflightGuard::assertMigrationLedger(['migration-a'], $expected);
    }

    public function test_requires_all_thirty_domain_tables_to_be_empty(): void
    {
        $empty = array_fill_keys(array_map(static fn (int $number): string => 'Table'.$number, range(1, 30)), 0);
        ImportPreflightGuard::assertDomainTablesEmpty($empty);

        $empty['Table30'] = 1;
        $this->expectException(RuntimeException::class);
        ImportPreflightGuard::assertDomainTablesEmpty($empty);
    }
}