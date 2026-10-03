<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Throwable;

class HealthController extends Controller
{
    public function show()
    {
        $started = microtime(true);
        $dbStarted = microtime(true);

        try {
            DB::select('SELECT 1');
            $database = ['status' => 'healthy', 'latencyMs' => (int) ((microtime(true) - $dbStarted) * 1000)];
        } catch (Throwable) {
            $database = ['status' => 'unhealthy', 'latencyMs' => 0];
        }

        $healthy = $database['status'] === 'healthy';

        return response()->json([
            'status' => $healthy ? 'pass' : 'fail',
            'version' => '1.0.0',
            'timestamp' => now()->toIso8601String(),
            'durationMs' => (int) ((microtime(true) - $started) * 1000),
            'services' => ['database' => $database, 'application' => ['status' => 'healthy']],
        ], $healthy ? 200 : 503);
    }
}
