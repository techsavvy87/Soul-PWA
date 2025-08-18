@extends('layouts.main')
@section('title', 'Update Faq')

@section('page-css')
<link href="{{ asset('src/assets/css/dark/apps/add.css') }}" rel="stylesheet" type="text/css" />
<style>
.swal-alert-icon .swal2-icon {
    font-size: 3em;
    /* Custom icon size */
    width: 60px;
    height: 60px;
}

.swal-alert-title {
    font-size: 20px;
    /* Custom title font size */
    font-weight: bold;
}
</style>
@endsection

@section('content')
<div class="row invoice layout-top-spacing layout-spacing">
    <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
        @include('layouts.alerts')
        <div class="doc-container">
            <h5 class="pt-2 pb-2">Edit Faq</h5>
            <form action="{{ route('update-faq') }}" method="post" id="update_form">
                @csrf
                <input type="hidden" name="faq_id" value="{{ $faq->id }}">
                <div class="row">
                    <div class="col-xl-12">
                        <div class="invoice-content">
                            <div class="invoice-detail-body">
                                <div class="row mb-4">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label for="question" style="margin-bottom: 2px">Question</label>
                                            <textarea class="form-control" id="question" name="question"
                                                placeholder="Write the question here..." style="height: 80px;"
                                                value="{{ $faq->question }}">{{ $faq->question }}</textarea>
                                        </div>
                                    </div>
                                </div>
                                <div class="row mb-4">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label for="answer" style="margin-bottom: 2px">Answer</label>
                                            <textarea class="form-control" id="answer" name="answer"
                                                placeholder="Write the answer here..." style="height: 160px;"
                                                value="{{ $faq->answer }}">{{ $faq->answer }}</textarea>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-flex flex-row-reverse">
                                    <div>
                                        <a href="{{ route('list-faq') }}" class="btn btn-outline-secondary">Cancel</a>
                                        <a href="javascript:save();" class="btn btn-primary">Save</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection

@section('page-js')
<script>
function save() {
    const question = $('#question').val();
    const answer = $('#answer').val();

    if (question === '' || answer === '') {
        Swal.fire({
            icon: 'error',
            title: 'The required fields should not be empty.',
            width: '420px',
            customClass: {
                icon: 'swal-alert-icon',
                title: 'swal-alert-title'
            }
        })
        return;
    }

    $('#update_form').submit();
}
</script>
@endsection