<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>New Feedback Received</title>
<style>
  body      { margin:0; padding:0; background:#f1f5f9; font-family:'Helvetica Neue',Arial,sans-serif; color:#0f172a; }
  .wrap     { max-width:560px; margin:40px auto; background:#fff; border-radius:16px;
              box-shadow:0 4px 24px rgba(0,0,0,.08); overflow:hidden; }
  .header   { background:linear-gradient(135deg,#0891b2,#0e7490); padding:32px 36px; }
  .header h1{ margin:0; color:#fff; font-size:20px; font-weight:700; letter-spacing:.01em; }
  .header p { margin:6px 0 0; color:rgba(255,255,255,.8); font-size:13px; }
  .body     { padding:32px 36px; }
  .badge    { display:inline-block; padding:4px 12px; border-radius:50px; font-size:12px;
              font-weight:700; letter-spacing:.04em; text-transform:uppercase; }
  .badge-qa { background:#e0f2fe; color:#0369a1; }
  .badge-voice { background:#f0fdf4; color:#166534; }
  .meta     { margin:20px 0; border:1.5px solid #e2e8f0; border-radius:10px; overflow:hidden; }
  .meta-row { display:flex; padding:12px 16px; border-bottom:1px solid #f1f5f9; }
  .meta-row:last-child { border-bottom:none; }
  .meta-key { width:120px; font-size:12px; font-weight:700; color:#64748b;
              text-transform:uppercase; letter-spacing:.04em; flex-shrink:0; }
  .meta-val { font-size:14px; color:#0f172a; font-weight:600; }
  .qa-list  { margin:20px 0 0; }
  .qa-item  { background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:10px;
              padding:14px 16px; margin-bottom:10px; }
  .qa-q     { font-size:13px; font-weight:700; color:#475569; margin-bottom:6px; }
  .qa-a     { font-size:22px; }
  .qa-label { display:inline-block; margin-left:8px; font-size:12px; font-weight:700;
              color:#0891b2; vertical-align:middle; }
  .cta      { margin-top:28px; text-align:center; }
  .cta a    { display:inline-block; background:linear-gradient(135deg,#0891b2,#0e7490);
              color:#fff; text-decoration:none; padding:12px 28px; border-radius:50px;
              font-size:14px; font-weight:700; letter-spacing:.02em; }
  .footer   { background:#f8fafc; padding:20px 36px; text-align:center;
              font-size:12px; color:#94a3b8; border-top:1px solid #e2e8f0; }
</style>
</head>
<body>
<div class="wrap">

  {{-- Header --}}
  <div class="header">
    <h1>New Feedback Received</h1>
    <p>{{ now()->format('l, F j, Y \a\t H:i') }}</p>
  </div>

  <div class="body">

    {{-- Type badge --}}
    @if($file->type === 'qa')
      <span class="badge badge-qa">📋 Q&amp;A Survey</span>
    @else
      <span class="badge badge-voice">🎙 Voice Recording</span>
    @endif

    {{-- Meta --}}
    <div class="meta">
      <div class="meta-row">
        <span class="meta-key">Phone</span>
        <span class="meta-val">{{ $file->phoneNo ?? '—' }}</span>
      </div>
      <div class="meta-row">
        <span class="meta-key">Type</span>
        <span class="meta-val">{{ $file->type === 'qa' ? 'Q&A Survey' : 'Voice Recording' }}</span>
      </div>
      <div class="meta-row">
        <span class="meta-key">Submitted</span>
        <span class="meta-val">{{ $file->created_at->format('Y-m-d H:i:s') }}</span>
      </div>
      <div class="meta-row">
        <span class="meta-key">Response #</span>
        <span class="meta-val">#{{ $file->id }}</span>
      </div>
    </div>

    {{-- Q&A answers --}}
    @if($file->type === 'qa' && is_array($file->qa) && count($file->qa) > 0)
      <p style="font-size:13px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.04em;margin:24px 0 10px;">
        Survey Answers
      </p>
      <div class="qa-list">
        @php
          $emojis = [4 => '😄', 3 => '🙂', 2 => '😐', 1 => '😕', 0 => '😠'];
          $labels = [4 => 'Great', 3 => 'Good', 2 => 'OK', 1 => 'Poor', 0 => 'Bad'];
        @endphp
        @foreach($file->qa as $i => $answer)
          @php $val = (int)($answer['value'] ?? -1); @endphp
          <div class="qa-item">
            <div class="qa-q">{{ $i + 1 }}. {{ $answer['question']['text'] ?? '—' }}</div>
            <div class="qa-a">
              {{ $emojis[$val] ?? '?' }}
              <span class="qa-label">{{ $labels[$val] ?? 'Unknown' }} ({{ $val }})</span>
            </div>
          </div>
        @endforeach
      </div>
    @endif

    {{-- CTA --}}
    <div class="cta">
      <a href="{{ config('app.url') }}/admin/responses">View in Admin Panel →</a>
    </div>

  </div>

  <div class="footer">
    This notification was sent automatically by {{ config('app.name') }}.<br>
    Do not reply to this email.
  </div>

</div>
</body>
</html>
