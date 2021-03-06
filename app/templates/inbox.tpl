<section id="inbox">
    <table>
        <caption class="clearfix">
            <form id="inbox-action">
                <select>
                    <option value="trash">Move to trash</option>
                    <option value="read">Mark as read</option>
                    <option value="unread">Mark as unread</option>
                </select>
                <button type="submit">Apply</button>
            </form>
            {{> filter}}
        </caption>
        <thead>
        <tr>
            <th class="no-sort"><input type="checkbox" name="mark-all"></th>
            <th>From</th>
            <th>To</th>
            <th>Subject</th>
            <th class="date">Date</th>
            <th>Size</th>
        </tr>
        </thead>
        <tbody></tbody>
    </table>
    {{#if inbox_notification }}
        <audio id="inbox-alert" src="/media/{{inbox_notification}}.ogg"></audio>
    {{/if}}
</section>