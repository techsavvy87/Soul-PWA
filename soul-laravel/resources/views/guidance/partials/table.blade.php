<div class="row ps-5 pe-5" id="cancel-row">
    <div class="col-xl-12 col-lg-12 col-sm-12 layout-top-spacing layout-spacing">
        @include('layouts.alerts')
        <div class="widget-content widget-content-area br-8">
            <table id="deck-category-list" class="table dt-table-hover" style="width:100%">
                <thead>
                    <tr>
                        <th class="checkbox-column"> No. </th>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($guidances as $guidance)
                    <tr>
                        <td class="checkbox-column">{{ $loop->index + 1 }}</td>
                        <td>
                            <span class="inv-number">{{ $guidance->name }}</span>
                        </td>
                        <td>
                            <a class="badge badge-light-primary text-start me-2 action-edit"
                                href="javascript:openEditModal({{ $guidance }} )">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="feather feather-edit-3">
                                    <path d="M12 20h9"></path>
                                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                </svg>
                            </a>
                            <a class="badge badge-light-danger text-start action-delete"
                                href="javascript:openDeleteAlert({{ $guidance->id }});">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="feather feather-trash">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path
                                        d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
                                    </path>
                                </svg>
                            </a>
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</div>
<div class="modal fade" id="guidance_modal" tabindex="-1" role="dialog" aria-labelledby="addCategoryModalTitle"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title add-title" id="add_category_title">Add Guidance</h5>
                <h5 class="modal-title edit-title" id="edit_category_title">Edit Guidance</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" class="feather feather-x">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>

            <div class="modal-body">
                <div class="add-contact-box">
                    <div class="add-contact-content">
                        <form id="guidance_form" method="POST" enctype="multipart/form-data">
                            @csrf
                            <input type="hidden" name="guidance_id" id="guidance_id">
                            <div class="contact-name">
                                <label style="margin-bottom: 4px; color: white">Name*</label>
                                <input type="text" id="guidance_name" class="form-control form-control-sm"
                                    name="guidance_name">
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline-secondary" data-bs-dismiss="modal"> <i class="flaticon-delete-1"></i>
                    Discard</button>
                <button id="btn_edit" class="float-left btn btn-success" onclick="submitCategory()">Save</button>
                <button id="btn_add" class="btn btn-primary" onclick="submitCategory()">Add</button>
            </div>
        </div>
    </div>
</div>
<script>
function openAddModal() {
    $('#guidance_modal #add_category_title').show();
    $('#guidance_modal #edit_category_title').hide();

    $('#guidance_modal #btn_add').show();
    $('#guidance_modal #btn_edit').hide();

    $('#guidance_form').attr('action', "{{ route('add-guidance') }}")
    $('#guidance_form #guidance_id').val('')
    $('#guidance_form #guidance_name').val('')
    $('.preview').css('background-image', 'none')

    $('#guidance_modal').modal('show');
}

function openEditModal(guidance) {
    $('#guidance_modal #add_category_title').hide();
    $('#guidance_modal #edit_category_title').show();

    $('#guidance_modal #btn_add').hide();
    $('#guidance_modal #btn_edit').show();

    $('#guidance_form').attr('action', "{{ route('update-guidance') }}")
    $('#guidance_form #guidance_id').val(guidance.id)
    $('#guidance_form #guidance_name').val(guidance.name)

    $('#guidance_modal').modal('show');
}

function submitCategory() {
    const guidanceName = $('#guidance_name').val();

    if (!guidanceName) {
        Swal.fire({
            icon: 'error',
            title: 'The required field should not be empty.',
            width: '420px',
            customClass: {
                icon: 'swal-alert-icon',
                title: 'swal-alert-title'
            }
        })
        return;
    }

    $('#guidance_form').submit();
}

function openDeleteAlert(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            var form = document.createElement("form");
            var input_id = document.createElement("input");
            var input_token = document.createElement("input");

            form.method = "POST";
            form.action = "{{ route('delete-guidance') }}";

            input_id.value = id;
            input_id.name = "guidance_id";
            form.appendChild(input_id);

            input_token.value = "{{ csrf_token() }}";
            input_token.name = "_token";
            form.appendChild(input_token);

            document.body.appendChild(form);

            form.submit();
        }
    })
}
</script>
<!-- Bootstrap pagination -->
{{ $guidances->links('pagination::bootstrap-5') }}