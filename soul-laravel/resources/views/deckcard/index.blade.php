@extends('layouts.main')
@section('title', 'List Decks')

@section('page-css')
<link href="{{ asset('src/plugins/src/table/datatable/datatables.css') }}" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="{{ asset('src/plugins/css/dark/table/datatable/dt-global_style.css') }}">
<style>
.badge-light-danger svg {
    color: #e67980 !important;
}

#page-length {
    padding: 6px 36px !important;
}

body.dark .table>tbody>tr>td {
    padding: 10px 0px !important;
}

body.dark .table>tbody>tr>td:first-child {
    padding-left: 20px !important;
}

@media (max-width: 767px) {
    .mobile-hide {
        display: none;
    }
}
</style>
@endsection

@section('content')
<div class="row ps-5 pe-5" id="cancel-row">
    <h5 class="pt-2 pb-2 layout-top-spacing ">Card</h5>
    <div class="d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center justify-between">
            <div class="d-flex justify-content-end align-items-center me-4">
                <label for="page-length" class="me-2 mb-0">Show</label>
                <select id="page-length" class="form-select w-auto">
                    <option value="5" selected>5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                </select>
            </div>
            <button class="btn btn-primary " tabindex="0" onclick="window.location='{{ route('add-card') }}'"><span>Add
                    New</span></button>
        </div>

        <form id="search-form" method="GET" class="my-3">
            <input type="text" name="search" id="search" value="{{ $search ?? '' }}" placeholder="Search cards..."
                class="form-control" style="max-width: 300px; display:inline-block;">
        </form>
    </div>

    <div id="table-data">
        @include('deckcard.partials.table')
    </div>
</div>
@endsection
@section('page-js')
<script>
function fetch_data(url) {
    let search = $('#search').val();
    let length = $('#page-length').val();
    $.ajax({
        url: url,
        data: {
            search: search,
            length: length
        },
        success: function(data) {
            $('#table-data').html(data);
            if ($('#table-data table tbody tr').length === 0) {
                $('#table-data').html('<p>No data found</p>');
            }
        }
    });
}

// 🔹 Handle pagination clicks
$(document).on('click', '.pagination a', function(e) {
    e.preventDefault();
    let url = $(this).attr('href');
    fetch_data(url);
});

// 🔹 Handle search input (auto or on Enter)
$('#search').on('keyup', function() {
    fetch_data("{{ route('cards.index') }}");
});

// 🔹 Trigger page length change
$('#page-length').on('change', function() {
    fetch_data();
});
</script>
@endsection