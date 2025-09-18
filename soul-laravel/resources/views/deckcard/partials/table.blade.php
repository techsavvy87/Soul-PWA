<div class="row" id="cancel-row">
    <div class="col-xl-12 col-lg-12 col-sm-12 layout-spacing">
        @include('layouts.alerts')
        <div class="widget-content widget-content-area br-8">
            <table id="deck-list" class="table dt-table-hover" style="width:100%">
                <thead>
                    <tr>
                        <th class="checkbox-column"> No. </th>
                        <th>Cover Image</th>
                        <th>Title</th>
                        <th class="mobile-hide">Description</th>
                        <th>Category</th>
                        <th>Emotion</th>
                        <th>Guidance</th>
                        <th>Status</th>
                        <th>Published Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($cards as $card)
                    <tr>
                        <td class="checkbox-column">{{ $loop->index + 1 }}</td>
                        <td>
                            @if (empty($card->card_img))
                            <img src="{{ asset('images/no_image.jpg') }}" class="rounded" alt="deck card picture"
                                style="object-fit: cover; width: 50px; height: 80px">
                            @else
                            <img src="{{ asset('storage/deckcards/'. $card->card_img) }}" class="rounded"
                                alt="deck card picture" style="object-fit: cover; width: 50px; height: 80px">
                            @endif
                        </td>
                        <td>
                            <a href="{{ route('edit-card', ['id' => $card->id]) }}"><span class="inv-number"
                                    style="white-space:pre-wrap; word-wrap:break-word">{{ $card->title }}</span></a>
                        </td>
                        <td class="mobile-hide">
                            <p class="align-self-center mb-0 user-name"
                                style="white-space:normal; word-wrap:break-word; width: 300px;">
                                {{ strlen(strip_tags($card->description)) > 140 ? substr(strip_tags($card->description), 0, 140)."..." : strip_tags($card->description) }}
                            </p>
                        </td>
                        <td>
                            <span style="white-space:pre-wrap; word-wrap:break-word">{{ $card->category->cname }}</span>
                        </td>
                        <td style="max-width: 120px; word-break: break-word; white-space: normal;">
                            @php
                            $emotionIds = is_array($card->emotions_id) ? $card->emotions_id : [$card->emotions_id];
                            @endphp

                            @foreach ($emotionIds as $emotionId)
                            @if(isset($emotions[$emotionId]))
                            <span class="badge badge-light-info inv-status"
                                style="display:inline-block; margin-bottom:2px; max-width:120px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">{{ $emotions[$emotionId]->name }}</span>
                            @endif
                            @endforeach
                        </td>
                        <td style="max-width: 120px; word-break: break-word; white-space: normal;">
                            @php
                            $guidanceIds = is_array($card->guidances_id) ? $card->guidances_id : [$card->guidances_id];
                            @endphp
                            @foreach ($guidanceIds as $guidanceId)
                            @if(isset($guidances[$guidanceId]))
                            <span class="badge badge-light-warning inv-status"
                                style="display:inline-block; margin-bottom:2px; max-width:120px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">{{ $guidances[$guidanceId]->name }}</span>
                            @endif
                            @endforeach
                        </td>
                        <td>
                            @if ($card->status === 'published')
                            <span class="badge badge-light-success inv-status">{{ ucfirst($card->status) }}</span>
                            @else
                            <span class="badge badge-light-warning inv-status">{{ ucfirst($card->status) }}</span>
                            @endif
                        </td>
                        <td>
                            @if (!empty($card->published_at))
                            <span class="inv-date">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="feather feather-calendar">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                                {{ Carbon\Carbon::parse($card->published_at)->format('M d, y') }}
                            </span>
                            @endif
                        </td>
                        <td>
                            <a class="badge badge-light-primary text-start me-2 action-edit"
                                href="{{ route('edit-card', ['id' => $card->id]) }}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="feather feather-edit-3">
                                    <path d="M12 20h9"></path>
                                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                </svg>
                            </a>
                            <a class="badge badge-light-danger text-start action-delete"
                                href="javascript:openDeleteAlert({{ $card->id }});">
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
<script>
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
            form.action = "{{ route('delete-card') }}";

            input_id.value = id;
            input_id.name = "card_id";
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
{{ $cards->links('pagination::bootstrap-5') }}