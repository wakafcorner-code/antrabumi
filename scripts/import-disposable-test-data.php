<?php

use Dotenv\Dotenv;
use Illuminate\Contracts\Console\Kernel;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use App\Services\Media\MediaStorageKeyResolver;

require dirname(__DIR__).'/vendor/autoload.php';

$app = require dirname(__DIR__).'/bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();

$sourceDatabase = 'antrabumi';
$targetDatabase = 'antrabumi_migration_test_2';
$productionDatabase = 'antrabumi_laravel';

$expectedCounts = [
    'User' => 2,
    'Permission' => 18,
    'Page' => 0,
    'ContributionArea' => 6,
    'ContributionAreaTranslation' => 12,
    'Experience' => 5,
    'ExperienceTranslation' => 10,
    'ExperienceMetric' => 0,
    'ExperienceContributionArea' => 0,
    'ExperienceMedia' => 1,
    'Person' => 8,
    'PersonTranslation' => 16,
    'Expertise' => 8,
    'PersonExpertise' => 0,
    'Knowledge' => 3,
    'KnowledgeTranslation' => 6,
    'Category' => 0,
    'KnowledgeCategory' => 0,
    'Tag' => 0,
    'KnowledgeTag' => 0,
    'ExperienceKnowledge' => 0,
    'KnowledgeContributionArea' => 0,
    'KnowledgeDownload' => 2,
    'KnowledgeMedia' => 3,
    'Media' => 19,
    'Partner' => 0,
    'ContactMessage' => 2,
    'NavigationItem' => 8,
    'SiteSetting' => 28,
    'AuditLog' => 73,
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

$normalize = static function (mixed $value): ?string {
    if ($value === null) {
        return null;
    }

    if (is_bool($value)) {
        return $value ? '1' : '0';
    }

    return is_scalar($value) ? (string) $value : json_encode($value, JSON_THROW_ON_ERROR);
};

$rowKey = static function (array $row, array $columns) use ($normalize): string {
    return json_encode(array_map(static fn (string $column): ?string => $normalize($row[$column] ?? null), $columns), JSON_THROW_ON_ERROR);
};

$quoteIdentifier = static fn (string $identifier): string => '`'.str_replace('`', '``', $identifier).'`';

if (count($expectedCounts) !== 30 || count($importOrder) !== 30 || array_sum($expectedCounts) !== 230) {
    throw new RuntimeException('The reviewed source table/count manifest is internally inconsistent.');
}

if (config('database.default') !== 'mysql'
    || config('database.connections.mysql.database') !== $targetDatabase
    || ! empty(config('database.connections.mysql.url'))
    || config('database.connections.mysql.database') === $sourceDatabase
    || config('database.connections.mysql.database') === $productionDatabase) {
    throw new RuntimeException('Refusing import: Laravel is not configured exclusively for the named disposable target.');
}

$connection = DB::connection('mysql');
$activeTarget = (string) $connection->selectOne('SELECT DATABASE() AS database_name')->database_name;
if ($activeTarget !== $targetDatabase || $activeTarget === $sourceDatabase || $activeTarget === $productionDatabase) {
    throw new RuntimeException('Refusing import: active MySQL schema is not the named disposable target.');
}

if (! Schema::connection('mysql')->hasTable('migrations')) {
    throw new RuntimeException('Refusing import: the reconciled Laravel migrations have not run on the disposable target.');
}

$ranMigrations = $connection->table('migrations')->orderBy('migration')->pluck('migration')->all();
sort($ranMigrations, SORT_STRING);
$expectedMigrationsSorted = $expectedMigrations;
sort($expectedMigrationsSorted, SORT_STRING);
if ($ranMigrations !== $expectedMigrationsSorted) {
    throw new RuntimeException('Refusing import: target migration ledger does not exactly match the reviewed schema.');
}

foreach (array_keys($expectedCounts) as $table) {
    if (! Schema::connection('mysql')->hasTable($table)) {
        throw new RuntimeException("Refusing import: target table {$table} is missing.");
    }

    if ($connection->table($table)->count() !== 0) {
        throw new RuntimeException("Refusing import: target table {$table} is not empty; no rows were changed.");
    }
}

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
    throw new RuntimeException('Refusing import: root Prisma DATABASE_URL is missing or does not name the read-only source database.');
}

$sourceDsn = 'mysql:host='.$sourceUrlParts['host'].';port='.($sourceUrlParts['port'] ?? 3306).';dbname='.$sourceDatabase.';charset=utf8mb4';
$sourcePdo = new PDO($sourceDsn, rawurldecode($sourceUrlParts['user']), rawurldecode($sourceUrlParts['pass']), [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
]);
$sourcePdo->exec('SET SESSION TRANSACTION READ ONLY');
$sourcePdo->beginTransaction();

if ((string) $sourcePdo->query('SELECT DATABASE()')->fetchColumn() !== $sourceDatabase) {
    $sourcePdo->rollBack();
    throw new RuntimeException('Refusing import: source read-only connection resolved to a different database.');
}

$sourceRows = [];
foreach ($importOrder as $table) {
    $sourceRows[$table] = $sourcePdo->query('SELECT * FROM '.$quoteIdentifier($table))->fetchAll(PDO::FETCH_ASSOC);
    if (count($sourceRows[$table]) !== $expectedCounts[$table]) {
        $sourcePdo->rollBack();
        throw new RuntimeException("Refusing import: source row count for {$table} differs from the reviewed manifest.");
    }
}

$sourceColumns = [];
foreach ($sourcePdo->query('SELECT TABLE_NAME, COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE()') as $column) {
    $table = $tableNameMap[strtolower($column['TABLE_NAME'])] ?? $column['TABLE_NAME'];
    $sourceColumns[$table][] = $column['COLUMN_NAME'];
}

foreach ($importOrder as $table) {
    $targetColumns = Schema::connection('mysql')->getColumnListing($table);
    $missingColumns = array_diff($sourceColumns[$table] ?? [], $targetColumns);
    if ($missingColumns !== []) {
        $sourcePdo->rollBack();
        throw new RuntimeException("Refusing import: target table {$table} is missing source columns: ".implode(', ', $missingColumns));
    }
}

$sourceForeignKeys = $sourcePdo->query("SELECT TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND REFERENCED_TABLE_NAME IS NOT NULL ORDER BY TABLE_NAME, COLUMN_NAME")->fetchAll(PDO::FETCH_ASSOC);
$targetForeignKeys = $connection->select('SELECT TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = ? AND REFERENCED_TABLE_NAME IS NOT NULL ORDER BY TABLE_NAME, COLUMN_NAME', [$targetDatabase]);

$metadataValue = static fn (array|object $row, string $column): mixed => is_array($row) ? $row[$column] : $row->{$column};
$canonicalTableName = static function (string $table) use ($tableNameMap): string {
    return $tableNameMap[strtolower($table)] ?? $table;
};
$foreignKeySignature = static function (array|object $foreignKey) use ($metadataValue, $canonicalTableName): string {
    return implode('|', [
        $canonicalTableName((string) $metadataValue($foreignKey, 'TABLE_NAME')),
        $metadataValue($foreignKey, 'COLUMN_NAME'),
        $canonicalTableName((string) $metadataValue($foreignKey, 'REFERENCED_TABLE_NAME')),
        $metadataValue($foreignKey, 'REFERENCED_COLUMN_NAME'),
    ]);
};
$sourceForeignKeySignatures = array_map($foreignKeySignature, $sourceForeignKeys);
$targetForeignKeySignatures = array_map($foreignKeySignature, $targetForeignKeys);
sort($sourceForeignKeySignatures, SORT_STRING);
sort($targetForeignKeySignatures, SORT_STRING);

$sourceEnumColumns = $sourcePdo->query("SELECT TABLE_NAME, COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND DATA_TYPE = 'enum' ORDER BY TABLE_NAME, COLUMN_NAME")->fetchAll(PDO::FETCH_ASSOC);

$readUniqueIndexes = static function (string $database) use ($connection): array {
    return $connection->select("SELECT TABLE_NAME, GROUP_CONCAT(COLUMN_NAME ORDER BY SEQ_IN_INDEX SEPARATOR ',') AS COLUMNS_LIST FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = ? AND NON_UNIQUE = 0 AND INDEX_NAME <> 'PRIMARY' GROUP BY TABLE_NAME, INDEX_NAME ORDER BY TABLE_NAME, COLUMNS_LIST", [$database]);
};

$sourceUniqueIndexes = $sourcePdo->query("SELECT TABLE_NAME, GROUP_CONCAT(COLUMN_NAME ORDER BY SEQ_IN_INDEX SEPARATOR ',') AS COLUMNS_LIST FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND NON_UNIQUE = 0 AND INDEX_NAME <> 'PRIMARY' GROUP BY TABLE_NAME, INDEX_NAME ORDER BY TABLE_NAME, COLUMNS_LIST")->fetchAll(PDO::FETCH_ASSOC);
$targetUniqueIndexes = $readUniqueIndexes($targetDatabase);
$sourceUniqueIndexes = array_values(array_filter($sourceUniqueIndexes, static fn (array $index): bool => isset($tableNameMap[strtolower($index['TABLE_NAME'])])));
$targetUniqueIndexes = array_values(array_filter($targetUniqueIndexes, static fn (object $index): bool => isset($tableNameMap[strtolower($index->TABLE_NAME)])));
$uniqueSignature = static fn (array|object $index): string => $canonicalTableName((string) $metadataValue($index, 'TABLE_NAME')).'|'.$metadataValue($index, 'COLUMNS_LIST');
$sourceUniqueSignatures = array_map($uniqueSignature, $sourceUniqueIndexes);
$targetUniqueSignatures = array_map($uniqueSignature, $targetUniqueIndexes);
sort($sourceUniqueSignatures, SORT_STRING);
sort($targetUniqueSignatures, SORT_STRING);

$sourcePdo->rollBack();

$verification = $connection->transaction(function () use (
    $connection,
    $sourceRows,
    $expectedCounts,
    $importOrder,
    $compositeKeys,
    $normalize,
    $rowKey,
    $quoteIdentifier,
    $sourceForeignKeys,
    $targetForeignKeys,
    $sourceForeignKeySignatures,
    $targetForeignKeySignatures,
    $sourceEnumColumns,
    $sourceUniqueSignatures,
    $targetUniqueSignatures,
    $tableNameMap,
    $targetDatabase
): array {
    $deferredUserImages = [];
    $deferredNavigationParents = [];

    foreach ($importOrder as $table) {
        $rows = $sourceRows[$table];
        if ($rows === []) {
            continue;
        }

        $insertRows = [];
        foreach ($rows as $row) {
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
            $connection->table($table)->insert($chunk);
        }
    }

    foreach ($deferredUserImages as $reference) {
        $connection->table('User')->where('id', $reference['id'])->update(['imageId' => $reference['imageId']]);
    }

    foreach ($deferredNavigationParents as $reference) {
        $connection->table('NavigationItem')->where('id', $reference['id'])->update(['parentId' => $reference['parentId']]);
    }

    $primaryKeys = array_fill_keys($importOrder, ['id']);
    foreach ($compositeKeys as $table => $columns) {
        $primaryKeys[$table] = $columns;
    }

    $rowCounts = [];
    $idComparisons = [];
    $compositeComparisons = [];
    $rowMismatches = [];
    $timestampChecks = ['values_compared' => 0, 'differences' => 0];
    $targetRowsByTable = [];

    foreach ($importOrder as $table) {
        $targetRows = array_map(static fn (object $row): array => (array) $row, $connection->table($table)->get()->all());
        $targetRowsByTable[$table] = $targetRows;
        $rowCounts[$table] = ['source' => count($sourceRows[$table]), 'target' => count($targetRows)];

        $sourceMap = [];
        foreach ($sourceRows[$table] as $row) {
            $sourceMap[$rowKey($row, $primaryKeys[$table])] = $row;
        }
        $targetMap = [];
        foreach ($targetRows as $row) {
            $targetMap[$rowKey($row, $primaryKeys[$table])] = $row;
        }

        $mismatchedValues = 0;
        foreach ($sourceMap as $key => $sourceRow) {
            if (! isset($targetMap[$key])) {
                continue;
            }

            foreach ($sourceRow as $column => $value) {
                if ($normalize($value) !== $normalize($targetMap[$key][$column] ?? null)) {
                    $mismatchedValues++;
                    if ($column === 'createdAt' || $column === 'updatedAt') {
                        $timestampChecks['differences']++;
                    }
                }

                if ($column === 'createdAt' || $column === 'updatedAt') {
                    $timestampChecks['values_compared']++;
                }
            }
        }

        $rowMismatches[$table] = $mismatchedValues;

        if ($primaryKeys[$table] === ['id']) {
            $sourceIds = array_map(static fn (array $row): string => (string) $row['id'], $sourceRows[$table]);
            $targetIds = array_map(static fn (array $row): string => (string) $row['id'], $targetRows);
            sort($sourceIds, SORT_STRING);
            sort($targetIds, SORT_STRING);
            $missing = array_values(array_diff($sourceIds, $targetIds));
            $extra = array_values(array_diff($targetIds, $sourceIds));
            $idComparisons[$table] = ['missing' => count($missing), 'extra' => count($extra)];
        } else {
            $sourceKeys = array_keys($sourceMap);
            $targetKeys = array_keys($targetMap);
            sort($sourceKeys, SORT_STRING);
            sort($targetKeys, SORT_STRING);
            $compositeComparisons[$table] = [
                'key_fields' => $primaryKeys[$table],
                'missing' => count(array_diff($sourceKeys, $targetKeys)),
                'extra' => count(array_diff($targetKeys, $sourceKeys)),
            ];
        }
    }

    $sourceDistributions = [];
    $targetDistributions = [];
    $enumMismatches = [];
    foreach ($sourceEnumColumns as $enumColumn) {
        $table = $tableNameMap[strtolower($enumColumn['TABLE_NAME'])] ?? $enumColumn['TABLE_NAME'];
        $column = $enumColumn['COLUMN_NAME'];
        $sourceCounts = [];
        $targetCounts = [];
        foreach ($sourceRows[$table] as $row) {
            $value = $row[$column] === null ? '[NULL]' : (string) $row[$column];
            $sourceCounts[$value] = ($sourceCounts[$value] ?? 0) + 1;
        }
        foreach ($targetRowsByTable[$table] as $row) {
            $value = $row[$column] === null ? '[NULL]' : (string) $row[$column];
            $targetCounts[$value] = ($targetCounts[$value] ?? 0) + 1;
        }
        ksort($sourceCounts, SORT_STRING);
        ksort($targetCounts, SORT_STRING);
        $signature = $table.'.'.$column;
        $sourceDistributions[$signature] = $sourceCounts;
        $targetDistributions[$signature] = $targetCounts;
        if ($sourceCounts !== $targetCounts) {
            $enumMismatches[] = $signature;
        }
    }

    $sourceOrphans = [];
    foreach ($sourceForeignKeys as $foreignKey) {
        $childTable = $tableNameMap[strtolower($foreignKey['TABLE_NAME'])] ?? $foreignKey['TABLE_NAME'];
        $childColumn = $foreignKey['COLUMN_NAME'];
        $parentTable = $tableNameMap[strtolower($foreignKey['REFERENCED_TABLE_NAME'])] ?? $foreignKey['REFERENCED_TABLE_NAME'];
        $parentColumn = $foreignKey['REFERENCED_COLUMN_NAME'];
        $parentValues = [];
        foreach ($sourceRows[$parentTable] as $parentRow) {
            $parentValues[$normalize($parentRow[$parentColumn] ?? null)] = true;
        }
        $orphans = 0;
        foreach ($sourceRows[$childTable] as $childRow) {
            $value = $childRow[$childColumn] ?? null;
            if ($value !== null && ! isset($parentValues[$normalize($value)])) {
                $orphans++;
            }
        }
        if ($orphans > 0) {
            $sourceOrphans[$childTable.'.'.$childColumn] = $orphans;
        }
    }

    $targetOrphans = [];
    foreach ($targetForeignKeys as $foreignKey) {
        $childTable = $tableNameMap[strtolower((string) $foreignKey->TABLE_NAME)] ?? (string) $foreignKey->TABLE_NAME;
        $childColumn = (string) $foreignKey->COLUMN_NAME;
        $parentTable = $tableNameMap[strtolower((string) $foreignKey->REFERENCED_TABLE_NAME)] ?? (string) $foreignKey->REFERENCED_TABLE_NAME;
        $parentColumn = (string) $foreignKey->REFERENCED_COLUMN_NAME;
        $sql = 'SELECT COUNT(*) AS orphan_count FROM '.$quoteIdentifier($childTable).' AS child LEFT JOIN '
            .$quoteIdentifier($parentTable).' AS parent ON child.'.$quoteIdentifier($childColumn).' = parent.'.$quoteIdentifier($parentColumn)
            .' WHERE child.'.$quoteIdentifier($childColumn).' IS NOT NULL AND parent.'.$quoteIdentifier($parentColumn).' IS NULL';
        $orphans = (int) $connection->selectOne($sql)->orphan_count;
        if ($orphans > 0) {
            $targetOrphans[$childTable.'.'.$childColumn] = $orphans;
        }
    }

    $passwordHashes = ['source_users' => count($sourceRows['User']), 'checked' => 0, 'length_60' => true, 'prefix_2b12' => true, 'byte_identical' => true];
    $targetUsersById = [];
    foreach ($targetRowsByTable['User'] as $user) {
        $targetUsersById[(string) $user['id']] = $user;
    }
    foreach ($sourceRows['User'] as $user) {
        $hash = $user['passwordHash'] ?? null;
        if ($hash === null) {
            continue;
        }
        $targetHash = $targetUsersById[(string) $user['id']]['passwordHash'] ?? null;
        $passwordHashes['checked']++;
        $passwordHashes['length_60'] = $passwordHashes['length_60'] && strlen((string) $hash) === 60 && strlen((string) $targetHash) === 60;
        $passwordHashes['prefix_2b12'] = $passwordHashes['prefix_2b12'] && str_starts_with((string) $hash, '$2b$12$') && str_starts_with((string) $targetHash, '$2b$12$');
        $passwordHashes['byte_identical'] = $passwordHashes['byte_identical'] && hash_equals((string) $hash, (string) $targetHash);
    }

    $mediaResolver = app(MediaStorageKeyResolver::class);
    $mediaPaths = ['rows' => count($targetRowsByTable['Media']), 'resolved' => 0, 'unsafe' => 0, 'files_transferred' => 0, 'files_pending' => count($targetRowsByTable['Media'])];
    foreach ($targetRowsByTable['Media'] as $media) {
        if ($mediaResolver->resolve($media['storageKey'] ?? null) === null) {
            $mediaPaths['unsafe']++;
        } else {
            $mediaPaths['resolved']++;
        }
    }

    $uniqueIndexesMatch = $sourceUniqueSignatures === $targetUniqueSignatures;
    $fkGraphMatch = $sourceForeignKeySignatures === $targetForeignKeySignatures;
    $countsMatch = true;
    foreach ($rowCounts as $table => $counts) {
        if ($counts['source'] !== $expectedCounts[$table] || $counts['target'] !== $counts['source']) {
            $countsMatch = false;
        }
    }
    $idsMatch = count(array_filter($idComparisons, static fn (array $result): bool => $result['missing'] !== 0 || $result['extra'] !== 0)) === 0;
    $compositesMatch = count(array_filter($compositeComparisons, static fn (array $result): bool => $result['missing'] !== 0 || $result['extra'] !== 0)) === 0;
    $rowsMatch = count(array_filter($rowMismatches, static fn (int $count): bool => $count !== 0)) === 0;
    $foreignKeysPass = $fkGraphMatch && $sourceOrphans === [] && $targetOrphans === [];
    $enumsMatch = $enumMismatches === [];
    $passwordPass = $passwordHashes['checked'] === 2 && $passwordHashes['length_60'] && $passwordHashes['prefix_2b12'] && $passwordHashes['byte_identical'];
    $mediaPass = $mediaPaths['rows'] === 19 && $mediaPaths['resolved'] === 19 && $mediaPaths['unsafe'] === 0;

    $result = [
        'row_counts' => $rowCounts,
        'id_comparisons' => $idComparisons,
        'composite_key_comparisons' => $compositeComparisons,
        'field_mismatches_by_table' => $rowMismatches,
        'timestamp_validation' => $timestampChecks,
        'foreign_keys' => [
            'source_count' => count($sourceForeignKeys),
            'target_count' => count($targetForeignKeys),
            'graph_matches' => $fkGraphMatch,
            'source_orphans' => $sourceOrphans,
            'target_orphans' => $targetOrphans,
        ],
        'enum_distributions' => ['source' => $sourceDistributions, 'target' => $targetDistributions, 'mismatches' => $enumMismatches],
        'unique_indexes' => ['source_count' => count($sourceUniqueSignatures), 'target_count' => count($targetUniqueSignatures), 'signatures_match' => $uniqueIndexesMatch],
        'password_hashes' => $passwordHashes,
        'media_paths' => $mediaPaths,
        'checks' => [
            'row_counts' => $countsMatch,
            'id_sets' => $idsMatch,
            'composite_keys' => $compositesMatch,
            'all_source_fields_identical' => $rowsMatch,
            'timestamps_identical' => $timestampChecks['differences'] === 0,
            'foreign_keys' => $foreignKeysPass,
            'enum_distributions' => $enumsMatch,
            'unique_indexes' => $uniqueIndexesMatch,
            'password_hashes' => $passwordPass,
            'media_keys_resolve' => $mediaPass,
        ],
    ];

    foreach ($result['checks'] as $check => $passed) {
        if (! $passed) {
            throw new RuntimeException('Import verification failed inside target transaction: '.$check.'; transaction will roll back.');
        }
    }

    return $result;
});

$applicationChecks = [
    'user_lookup_count' => $connection->table('User')->whereNotNull('email')->count(),
    'published_knowledge_count' => $connection->table('Knowledge')->where('status', 'PUBLISHED')->count(),
    'published_experience_count' => $connection->table('Experience')->where('status', 'PUBLISHED')->count(),
    'published_person_count' => $connection->table('Person')->where('status', 'PUBLISHED')->count(),
    'published_partner_count' => $connection->table('Partner')->where('status', 'PUBLISHED')->count(),
    'contact_record_count' => $connection->table('ContactMessage')->count(),
    'dashboard_counters' => [],
];
foreach (['User', 'Experience', 'Person', 'Knowledge', 'Media', 'ContactMessage', 'AuditLog'] as $table) {
    $applicationChecks['dashboard_counters'][$table] = $connection->table($table)->count();
}

$report = [
    'source_database' => $sourceDatabase,
    'target_database' => $activeTarget,
    'production_database_modified' => false,
    'source_modified' => false,
    'physical_media_transferred' => 0,
    'physical_media_pending' => 19,
    'application_checks' => $applicationChecks,
    'verification' => $verification,
];

echo json_encode($report, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR), PHP_EOL;