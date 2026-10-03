<?php

use App\Services\Import\ImportPreflightGuard;
use App\Services\Media\MediaStorageKeyResolver;
use Dotenv\Dotenv;
use Illuminate\Contracts\Console\Kernel;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

require dirname(__DIR__).'/vendor/autoload.php';

$app = require dirname(__DIR__).'/bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();

$sourceDatabase = 'antrabumi';
$targetDatabase = 'antrabumi_laravel';
$testDatabase = 'antrabumi_migration_test_2';
$execute = in_array('--execute', $argv, true);
$confirmedTarget = in_array('--confirm-target='.$targetDatabase, $argv, true);
$allowedArguments = ['--execute', '--confirm-target='.$targetDatabase];
$unknownArguments = array_values(array_diff(array_slice($argv, 1), $allowedArguments));

if ($unknownArguments !== [] || $execute !== $confirmedTarget) {
    throw new RuntimeException('Use no arguments for read-only preparation, or pass both --execute and --confirm-target=antrabumi_laravel after explicit authorization.');
}

$expectedCounts = [
    'User' => 2, 'Permission' => 18, 'Page' => 0, 'ContributionArea' => 6,
    'ContributionAreaTranslation' => 12, 'Experience' => 5, 'ExperienceTranslation' => 10,
    'ExperienceMetric' => 0, 'ExperienceContributionArea' => 0, 'ExperienceMedia' => 1,
    'Person' => 8, 'PersonTranslation' => 16, 'Expertise' => 8, 'PersonExpertise' => 0,
    'Knowledge' => 3, 'KnowledgeTranslation' => 6, 'Category' => 0, 'KnowledgeCategory' => 0,
    'Tag' => 0, 'KnowledgeTag' => 0, 'ExperienceKnowledge' => 0, 'KnowledgeContributionArea' => 0,
    'KnowledgeDownload' => 2, 'KnowledgeMedia' => 3, 'Media' => 19, 'Partner' => 0,
    'ContactMessage' => 2, 'NavigationItem' => 8, 'SiteSetting' => 28, 'AuditLog' => 73,
];

$importOrder = [
    'User', 'Permission', 'ContributionArea', 'Expertise', 'Category', 'Tag', 'SiteSetting', 'NavigationItem',
    'Media', 'Page', 'Experience', 'Person', 'Knowledge', 'Partner', 'ContributionAreaTranslation',
    'ExperienceTranslation', 'ExperienceMetric', 'PersonTranslation', 'KnowledgeTranslation',
    'ExperienceContributionArea', 'ExperienceMedia', 'PersonExpertise', 'KnowledgeCategory', 'KnowledgeTag',
    'ExperienceKnowledge', 'KnowledgeContributionArea', 'KnowledgeDownload', 'KnowledgeMedia', 'ContactMessage', 'AuditLog',
];

$compositeKeys = [
    'ExperienceContributionArea' => ['experienceId', 'contributionAreaId'],
    'ExperienceMedia' => ['experienceId', 'mediaId'],
    'PersonExpertise' => ['personId', 'expertiseId'],
    'KnowledgeCategory' => ['knowledgeId', 'categoryId'],
    'KnowledgeTag' => ['knowledgeId', 'tagId'],
    'ExperienceKnowledge' => ['experienceId', 'knowledgeId'],
    'KnowledgeContributionArea' => ['knowledgeId', 'contributionAreaId'],
    'KnowledgeMedia' => ['knowledgeId', 'mediaId'],
];

$expectedMigrations = [
    '0001_01_01_000000_create_users_table',
    '0001_01_01_000001_create_cache_table',
    '0001_01_01_000002_create_jobs_table',
    '2026_10_02_000001_create_reference_and_settings_tables',
    '2026_10_02_000002_create_media_table',
    '2026_10_02_000003_create_content_tables',
    '2026_10_02_000004_create_content_pivots',
];

if (count($expectedCounts) !== 30 || count($importOrder) !== 30 || array_sum($expectedCounts) !== 230) {
    throw new RuntimeException('Reviewed source table/count manifest is inconsistent.');
}

if (config('database.default') !== 'mysql'
    || config('database.connections.mysql.database') !== $targetDatabase
    || ! empty(config('database.connections.mysql.url'))) {
    throw new RuntimeException('Refusing: configured default MySQL target must be exactly antrabumi_laravel and must not use DB_URL.');
}

$target = DB::connection('mysql');
$activeTarget = (string) $target->selectOne('SELECT DATABASE() AS database_name')->database_name;
ImportPreflightGuard::assertTargetDatabase((string) config('database.connections.mysql.database'), $activeTarget);
if ($activeTarget === $sourceDatabase || $activeTarget === $testDatabase) {
    throw new RuntimeException('Refusing: active target is a protected source or disposable schema.');
}

$migrationStatus = [];
if (Schema::connection('mysql')->hasTable('migrations')) {
    $migrationStatus = $target->table('migrations')->orderBy('migration')->pluck('migration')->all();
}
$preflightFailures = [];
try {
    ImportPreflightGuard::assertMigrationLedger($migrationStatus, $expectedMigrations);
} catch (RuntimeException $exception) {
    $preflightFailures[] = $exception->getMessage();
}

$targetCounts = [];
foreach ($expectedCounts as $table => $_expected) {
    if (! Schema::connection('mysql')->hasTable($table)) {
        $preflightFailures[] = "Target table {$table} is missing.";
        $targetCounts[$table] = null;
        continue;
    }
    $targetCounts[$table] = (int) $target->table($table)->count();
}
$allTargetTablesPresent = count(array_filter($targetCounts, static fn (mixed $count): bool => $count !== null)) === 30;
if ($allTargetTablesPresent) {
    try {
        ImportPreflightGuard::assertDomainTablesEmpty($targetCounts);
    } catch (RuntimeException $exception) {
        $preflightFailures[] = $exception->getMessage();
    }
} else {
    $preflightFailures[] = 'All 30 target domain tables must exist before import.';
}
$targetIsEmpty = $allTargetTablesPresent && array_sum($targetCounts) === 0;

$tableNameMap = [];
foreach (array_keys($expectedCounts) as $table) {
    $tableNameMap[strtolower($table)] = $table;
}

$projectRoot = dirname(__DIR__, 2);
$sourceEnvironment = Dotenv::createImmutable($projectRoot)->safeLoad();
$sourceUrl = $sourceEnvironment['DATABASE_URL'] ?? getenv('DATABASE_URL') ?: null;
$sourceUrlParts = is_string($sourceUrl) ? parse_url($sourceUrl) : false;
if (! is_array($sourceUrlParts)
    || strtolower((string) ($sourceUrlParts['scheme'] ?? '')) !== 'mysql'
    || ltrim((string) ($sourceUrlParts['path'] ?? ''), '/') !== $sourceDatabase
    || empty($sourceUrlParts['host'])
    || ! array_key_exists('user', $sourceUrlParts)
    || ! array_key_exists('pass', $sourceUrlParts)) {
    throw new RuntimeException('Refusing: Prisma DATABASE_URL must name exactly the antrabumi source database.');
}

$source = new PDO(
    'mysql:host='.$sourceUrlParts['host'].';port='.($sourceUrlParts['port'] ?? 3306).';dbname='.$sourceDatabase.';charset=utf8mb4',
    rawurldecode($sourceUrlParts['user']),
    rawurldecode($sourceUrlParts['pass']),
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
);
$source->exec('SET SESSION TRANSACTION READ ONLY');
$source->beginTransaction();
ImportPreflightGuard::assertSourceDatabase($sourceDatabase, (string) $source->query('SELECT DATABASE()')->fetchColumn());

$quoteIdentifier = static fn (string $identifier): string => '`'.str_replace('`', '``', $identifier).'`';
$sourceRows = [];
$sourceCounts = [];
foreach ($importOrder as $table) {
    $sourceRows[$table] = $source->query('SELECT * FROM '.$quoteIdentifier($table))->fetchAll(PDO::FETCH_ASSOC);
    $sourceCounts[$table] = count($sourceRows[$table]);
    if ($sourceCounts[$table] !== $expectedCounts[$table]) {
        $preflightFailures[] = "Source row count for {$table} differs from the reviewed baseline.";
    }
}

$sourceColumns = [];
foreach ($source->query('SELECT TABLE_NAME, COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE()') as $column) {
    $canonical = $tableNameMap[strtolower($column['TABLE_NAME'])] ?? null;
    if ($canonical !== null) {
        $sourceColumns[$canonical][] = $column['COLUMN_NAME'];
    }
}
foreach ($importOrder as $table) {
    if (! Schema::connection('mysql')->hasTable($table)) {
        continue;
    }
    $missingColumns = array_diff($sourceColumns[$table] ?? [], Schema::connection('mysql')->getColumnListing($table));
    if ($missingColumns !== []) {
        $preflightFailures[] = "Target {$table} lacks source columns: ".implode(', ', $missingColumns);
    }
}

$preflight = [
    'source_database_configured' => $sourceDatabase,
    'source_database_active' => $sourceDatabase,
    'target_database_configured' => (string) config('database.connections.mysql.database'),
    'target_database_active' => $activeTarget,
    'domain_table_count' => count($expectedCounts),
    'migration_status' => array_map(static fn (string $migration): array => ['migration' => $migration, 'status' => 'Ran'], $migrationStatus),
    'target_empty' => $targetIsEmpty,
    'guard_failures' => $preflightFailures,
    'row_counts' => [],
    'mode' => $execute ? 'execute-requested' : 'preflight-only',
];
foreach ($expectedCounts as $table => $expected) {
    $preflight['row_counts'][$table] = [
        'source' => $sourceCounts[$table],
        'target' => $targetCounts[$table],
        'target_empty' => $targetCounts[$table] === 0,
        'source_baseline' => $expected,
    ];
}
echo json_encode(['preflight' => $preflight], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR), PHP_EOL;

if ($preflightFailures !== []) {
    $source->rollBack();
    throw new RuntimeException('Refusing before INSERT: '.implode(' ', $preflightFailures));
}

if (! $execute) {
    $source->rollBack();
    echo "READ-ONLY PREFLIGHT ONLY; no target writes were performed.", PHP_EOL;
    exit(0);
}

$normalize = static function (mixed $value): ?string {
    if ($value === null) {
        return null;
    }
    if (is_bool($value)) {
        return $value ? '1' : '0';
    }
    return is_scalar($value) ? (string) $value : json_encode($value, JSON_THROW_ON_ERROR);
};
$rowKey = static fn (array $row, array $columns): string => json_encode(
    array_map(static fn (string $column): ?string => $normalize($row[$column] ?? null), $columns),
    JSON_THROW_ON_ERROR
);

$sourceForeignKeys = $source->query('SELECT TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND REFERENCED_TABLE_NAME IS NOT NULL ORDER BY TABLE_NAME, COLUMN_NAME')->fetchAll(PDO::FETCH_ASSOC);
$targetForeignKeys = $target->select('SELECT TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = ? AND REFERENCED_TABLE_NAME IS NOT NULL ORDER BY TABLE_NAME, COLUMN_NAME', [$targetDatabase]);
$sourceEnumColumns = $source->query("SELECT TABLE_NAME, COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND DATA_TYPE = 'enum' ORDER BY TABLE_NAME, COLUMN_NAME")->fetchAll(PDO::FETCH_ASSOC);
$sourceUniqueIndexes = $source->query("SELECT TABLE_NAME, GROUP_CONCAT(COLUMN_NAME ORDER BY SEQ_IN_INDEX SEPARATOR ',') AS COLUMNS_LIST FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND NON_UNIQUE = 0 AND INDEX_NAME <> 'PRIMARY' GROUP BY TABLE_NAME, INDEX_NAME ORDER BY TABLE_NAME, COLUMNS_LIST")->fetchAll(PDO::FETCH_ASSOC);
$targetUniqueIndexes = $target->select("SELECT TABLE_NAME, GROUP_CONCAT(COLUMN_NAME ORDER BY SEQ_IN_INDEX SEPARATOR ',') AS COLUMNS_LIST FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = ? AND NON_UNIQUE = 0 AND INDEX_NAME <> 'PRIMARY' GROUP BY TABLE_NAME, INDEX_NAME ORDER BY TABLE_NAME, COLUMNS_LIST", [$targetDatabase]);
$sourceUniqueIndexes = array_values(array_filter($sourceUniqueIndexes, static fn (array $index): bool => isset($tableNameMap[strtolower($index['TABLE_NAME'])])));
$targetUniqueIndexes = array_values(array_filter($targetUniqueIndexes, static fn (object $index): bool => isset($tableNameMap[strtolower($index->TABLE_NAME)])));
$canonicalTable = static fn (string $table): string => $tableNameMap[strtolower($table)] ?? $table;
$metadataValue = static fn (array|object $row, string $column): mixed => is_array($row) ? $row[$column] : $row->{$column};
$foreignKeySignature = static fn (array|object $fk): string => implode('|', [
    $canonicalTable((string) $metadataValue($fk, 'TABLE_NAME')),
    $metadataValue($fk, 'COLUMN_NAME'),
    $canonicalTable((string) $metadataValue($fk, 'REFERENCED_TABLE_NAME')),
    $metadataValue($fk, 'REFERENCED_COLUMN_NAME'),
]);
$sourceFkSignatures = array_map($foreignKeySignature, $sourceForeignKeys);
$targetFkSignatures = array_map($foreignKeySignature, $targetForeignKeys);
$uniqueSignature = static fn (array|object $index): string => $canonicalTable((string) $metadataValue($index, 'TABLE_NAME')).'|'.$metadataValue($index, 'COLUMNS_LIST');
$sourceUniqueSignatures = array_map($uniqueSignature, $sourceUniqueIndexes);
$targetUniqueSignatures = array_map($uniqueSignature, $targetUniqueIndexes);
sort($sourceFkSignatures, SORT_STRING);
sort($targetFkSignatures, SORT_STRING);
sort($sourceUniqueSignatures, SORT_STRING);
sort($targetUniqueSignatures, SORT_STRING);

$source->rollBack();

$verification = $target->transaction(function () use (
    $target, $sourceRows, $expectedCounts, $importOrder, $compositeKeys, $normalize, $rowKey, $quoteIdentifier,
    $sourceForeignKeys, $targetForeignKeys, $sourceFkSignatures, $targetFkSignatures, $sourceEnumColumns,
    $sourceUniqueSignatures, $targetUniqueSignatures, $tableNameMap
): array {
    $deferredUserImages = [];
    $deferredNavigationParents = [];
    foreach ($importOrder as $table) {
        $insertRows = [];
        foreach ($sourceRows[$table] as $row) {
            if ($table === 'User' && ($row['imageId'] ?? null) !== null) {
                $deferredUserImages[] = ['id' => $row['id'], 'imageId' => $row['imageId']];
                $row['imageId'] = null;
            }
            if ($table === 'NavigationItem' && ($row['parentId'] ?? null) !== null) {
                $deferredNavigationParents[] = ['id' => $row['id'], 'parentId' => $row['parentId']];
                $row['parentId'] = null;
            }
            $insertRows[] = $row;
        }
        foreach (array_chunk($insertRows, 100) as $chunk) {
            $target->table($table)->insert($chunk);
        }
    }
    foreach ($deferredUserImages as $ref) {
        $target->table('User')->where('id', $ref['id'])->update(['imageId' => $ref['imageId']]);
    }
    foreach ($deferredNavigationParents as $ref) {
        $target->table('NavigationItem')->where('id', $ref['id'])->update(['parentId' => $ref['parentId']]);
    }

    $primaryKeys = array_fill_keys($importOrder, ['id']);
    foreach ($compositeKeys as $table => $columns) {
        $primaryKeys[$table] = $columns;
    }
    $targetRowsByTable = [];
    $counts = [];
    $ids = [];
    $composites = [];
    $fieldMismatches = [];
    $timestampValues = 0;
    $timestampMismatches = 0;
    foreach ($importOrder as $table) {
        $targetRowsByTable[$table] = array_map(static fn (object $row): array => (array) $row, $target->table($table)->get()->all());
        $sourceRowsForTable = $sourceRows[$table];
        $targetRows = $targetRowsByTable[$table];
        $counts[$table] = ['source' => count($sourceRowsForTable), 'target' => count($targetRows)];
        $sourceMap = [];
        foreach ($sourceRowsForTable as $row) {
            $sourceMap[$rowKey($row, $primaryKeys[$table])] = $row;
        }
        $targetMap = [];
        foreach ($targetRows as $row) {
            $targetMap[$rowKey($row, $primaryKeys[$table])] = $row;
        }
        $mismatches = 0;
        foreach ($sourceMap as $key => $sourceRow) {
            if (! isset($targetMap[$key])) {
                continue;
            }
            foreach ($sourceRow as $column => $value) {
                $equal = $normalize($value) === $normalize($targetMap[$key][$column] ?? null);
                if (! $equal) {
                    $mismatches++;
                    if ($column === 'createdAt' || $column === 'updatedAt') {
                        $timestampMismatches++;
                    }
                }
                if ($column === 'createdAt' || $column === 'updatedAt') {
                    $timestampValues++;
                }
            }
        }
        $fieldMismatches[$table] = $mismatches;
        if ($primaryKeys[$table] === ['id']) {
            $sourceIds = array_map(static fn (array $row): string => (string) $row['id'], $sourceRowsForTable);
            $targetIds = array_map(static fn (array $row): string => (string) $row['id'], $targetRows);
            sort($sourceIds, SORT_STRING);
            sort($targetIds, SORT_STRING);
            $ids[$table] = ['missing' => count(array_diff($sourceIds, $targetIds)), 'extra' => count(array_diff($targetIds, $sourceIds))];
        } else {
            $sourceKeys = array_keys($sourceMap);
            $targetKeys = array_keys($targetMap);
            sort($sourceKeys, SORT_STRING);
            sort($targetKeys, SORT_STRING);
            $composites[$table] = ['missing' => count(array_diff($sourceKeys, $targetKeys)), 'extra' => count(array_diff($targetKeys, $sourceKeys))];
        }
    }

    $sourceEnums = [];
    $targetEnums = [];
    $enumDistribution = static function (array $rows, string $column): array {
        $counts = [];
        foreach ($rows as $row) {
            $value = $row[$column] === null ? '[NULL]' : (string) $row[$column];
            $counts[$value] = ($counts[$value] ?? 0) + 1;
        }
        ksort($counts, SORT_STRING);
        return $counts;
    };
    foreach ($sourceEnumColumns as $enumColumn) {
        $table = $tableNameMap[strtolower($enumColumn['TABLE_NAME'])] ?? null;
        if ($table === null) {
            continue;
        }
        $column = $enumColumn['COLUMN_NAME'];
        $sourceEnums[$table.'.'.$column] = $enumDistribution($sourceRows[$table], $column);
        $targetEnums[$table.'.'.$column] = $enumDistribution($targetRowsByTable[$table], $column);
    }
    $enumKeys = array_unique([...array_keys($sourceEnums), ...array_keys($targetEnums)]);
    $enumMismatches = [];
    foreach ($enumKeys as $key) {
        if (($sourceEnums[$key] ?? []) !== ($targetEnums[$key] ?? [])) {
            $enumMismatches[] = $key;
        }
    }

    $sourceOrphans = [];
    foreach ($sourceForeignKeys as $fk) {
        $child = $tableNameMap[strtolower($fk['TABLE_NAME'])] ?? null;
        $parent = $tableNameMap[strtolower($fk['REFERENCED_TABLE_NAME'])] ?? null;
        if ($child === null || $parent === null) {
            continue;
        }
        $parentValues = [];
        foreach ($sourceRows[$parent] as $row) {
            $parentValues[$normalize($row[$fk['REFERENCED_COLUMN_NAME']] ?? null)] = true;
        }
        foreach ($sourceRows[$child] as $row) {
            $value = $row[$fk['COLUMN_NAME']] ?? null;
            if ($value !== null && ! isset($parentValues[$normalize($value)])) {
                $sourceOrphans[] = $child.'.'.$fk['COLUMN_NAME'];
            }
        }
    }
    $targetOrphans = [];
    foreach ($targetForeignKeys as $fk) {
        $child = $tableNameMap[strtolower((string) $fk->TABLE_NAME)] ?? null;
        $parent = $tableNameMap[strtolower((string) $fk->REFERENCED_TABLE_NAME)] ?? null;
        if ($child === null || $parent === null) {
            continue;
        }
        $childColumn = $quoteIdentifier((string) $fk->COLUMN_NAME);
        $parentColumn = $quoteIdentifier((string) $fk->REFERENCED_COLUMN_NAME);
        $sql = 'SELECT COUNT(*) AS n FROM '.$quoteIdentifier($child).' c LEFT JOIN '.$quoteIdentifier($parent).' p ON c.'.$childColumn.' = p.'.$parentColumn.' WHERE c.'.$childColumn.' IS NOT NULL AND p.'.$parentColumn.' IS NULL';
        if ((int) $target->selectOne($sql)->n > 0) {
            $targetOrphans[] = $child.'.'.$fk->COLUMN_NAME;
        }
    }

    $passwords = [];
    foreach ($sourceRows['User'] as $user) {
        $targetHash = null;
        foreach ($targetRowsByTable['User'] as $targetUser) {
            if ((string) $targetUser['id'] === (string) $user['id']) {
                $targetHash = $targetUser['passwordHash'] ?? null;
                break;
            }
        }
        $sourceHash = $user['passwordHash'] ?? null;
        $passwords[(string) $user['id']] = [
            'identical' => $sourceHash === $targetHash,
            'length_60' => $sourceHash === null || (strlen((string) $sourceHash) === 60 && strlen((string) $targetHash) === 60),
            'prefix_2b12' => $sourceHash === null || (str_starts_with((string) $sourceHash, '$2b$12$') && str_starts_with((string) $targetHash, '$2b$12$')),
        ];
    }
    $mediaResolver = app(MediaStorageKeyResolver::class);
    $media = ['rows' => count($targetRowsByTable['Media']), 'resolved' => 0, 'invalid' => 0, 'physical_files_transferred' => 0, 'physical_files_pending' => count($targetRowsByTable['Media'])];
    foreach ($targetRowsByTable['Media'] as $item) {
        if ($mediaResolver->resolve($item['storageKey'] ?? null) === null) {
            $media['invalid']++;
        } else {
            $media['resolved']++;
        }
    }

    $checks = [
        'row_counts' => count(array_filter($counts, static fn (array $count, string $table): bool => $count['source'] !== $expectedCounts[$table] || $count['target'] !== $count['source'], ARRAY_FILTER_USE_BOTH)) === 0,
        'exact_ids' => count(array_filter($ids, static fn (array $item): bool => $item['missing'] !== 0 || $item['extra'] !== 0)) === 0,
        'composite_keys' => count(array_filter($composites, static fn (array $item): bool => $item['missing'] !== 0 || $item['extra'] !== 0)) === 0,
        'field_equality' => count(array_filter($fieldMismatches, static fn (int $count): bool => $count !== 0)) === 0,
        'timestamps' => $timestampMismatches === 0,
        'foreign_keys_and_orphans' => $sourceFkSignatures === $targetFkSignatures && $sourceOrphans === [] && $targetOrphans === [],
        'enum_distributions' => $enumMismatches === [],
        'unique_indexes' => $sourceUniqueSignatures === $targetUniqueSignatures,
        'password_hashes' => count(array_filter($passwords, static fn (array $item): bool => ! $item['identical'] || ! $item['length_60'] || ! $item['prefix_2b12'])) === 0,
        'media_rows_and_keys' => $media['rows'] === 19 && $media['resolved'] === 19 && $media['invalid'] === 0,
    ];
    $result = compact('counts', 'ids', 'composites', 'fieldMismatches', 'timestampValues', 'timestampMismatches', 'sourceOrphans', 'targetOrphans', 'sourceEnums', 'targetEnums', 'enumMismatches', 'passwords', 'media', 'checks');
    foreach ($checks as $name => $passed) {
        if (! $passed) {
            throw new RuntimeException('Post-import validation failed: '.$name.'; target transaction rolled back.');
        }
    }
    return $result;
});

echo json_encode([
    'result' => 'PASS',
    'source_database' => $sourceDatabase,
    'target_database' => $activeTarget,
    'production_target_modified' => true,
    'source_modified' => false,
    'physical_media_transferred' => 0,
    'physical_media_pending' => 19,
    'verification' => $verification,
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR), PHP_EOL;