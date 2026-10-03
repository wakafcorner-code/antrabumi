<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class MigrationPendingController extends Controller
{
    public function __invoke(): JsonResponse
    {
        return response()->json([
            'success' => false,
            'error' => 'This API endpoint is registered but its feature has not been migrated yet.',
        ], 501);
    }
}
