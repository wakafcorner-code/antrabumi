@if (session('status'))
    <div role="status" class="mb-5 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{{ session('status') }}</div>
@endif
@if ($errors->any())
    <div role="alert" class="mb-5 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{{ $errors->first() }}</div>
@endif
