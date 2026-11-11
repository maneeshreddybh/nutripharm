/* Sends website enquiries to the company inbox using FormSubmit
   (https://formsubmit.co), a free form-to-email service for static sites.

   Setup: the first message sent to a new address triggers a one-time
   "Activate Form" email to that inbox. Click the link in it, and every
   later enquiry is delivered. Until then, messages are held. */
(function () {
    var INBOX = 'info@vividnutripharm.com';
    var ENDPOINT = 'https://formsubmit.co/ajax/' + INBOX;

    // fields: plain object of label -> value. Returns a Promise that
    // resolves on success and rejects on any failure.
    function send(fields, subject) {
        var body = {
            _subject: subject,
            _template: 'table'
        };
        Object.keys(fields).forEach(function (k) {
            var v = fields[k];
            if (v !== undefined && v !== null && String(v).trim() !== '') body[k] = String(v).trim();
        });
        // FormSubmit uses a field called "email" as the reply-to address.
        if (fields.email) body.email = String(fields.email).trim();

        return fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(body)
        }).then(function (res) {
            return res.json().catch(function () { return {}; }).then(function (data) {
                if (!res.ok || String(data.success) !== 'true') {
                    throw new Error(data.message || ('HTTP ' + res.status));
                }
                return data;
            });
        });
    }

    // Shows a small error note after `anchor` (created once, reused).
    function showError(anchor, show) {
        var id = (anchor.id || 'vn') + '-send-error';
        var el = document.getElementById(id);
        if (!el && show) {
            el = document.createElement('p');
            el.id = id;
            el.setAttribute('role', 'alert');
            el.style.cssText = 'grid-column:1/-1;margin:12px 0 0;padding:12px 16px;border-radius:12px;' +
                'background:#fdf0ef;border:1px solid #f1c9c5;color:#8a2a20;font-size:13.5px;line-height:1.5;';
            el.innerHTML = 'Sorry, your message could not be sent. Please try again, or email us at ' +
                '<a href="mailto:' + INBOX + '" style="color:#8a2a20;font-weight:600;">' + INBOX + '</a>.';
            anchor.parentNode.insertBefore(el, anchor.nextSibling);
        }
        if (el) el.style.display = show ? '' : 'none';
    }

    // Puts a submit button into a "Sending..." state and back.
    function setSending(button, sending) {
        if (!button) return;
        if (sending) {
            button.dataset.vnLabel = button.innerHTML;
            button.disabled = true;
            button.style.opacity = '0.7';
            button.style.cursor = 'wait';
            button.textContent = 'Sending…';
        } else {
            if (button.dataset.vnLabel) button.innerHTML = button.dataset.vnLabel;
            button.disabled = false;
            button.style.opacity = '';
            button.style.cursor = '';
        }
    }

    window.vnEnquiry = { send: send, showError: showError, setSending: setSending, inbox: INBOX };
})();
