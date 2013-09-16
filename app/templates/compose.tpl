<form id="compose" method="post">
    <fieldset>
        <p>
            <label for="compose-from">From</label>
            <select name="from" id="compose-from">{{{options}}}</select>
            <span id="compose-id">{{selectedId}}</span>
        </p>
        <p><label for="compose-to">To</label> <input type="text" name="to" id="compose-to" value="{{toAddress}}"></p>
        <p><label for="compose-subject">Subject</label> <input type="text" name="subject" id="compose-subject"></p>
        <textarea name="message" class="message" id="compose-body"></textarea>
    </fieldset>
</form>