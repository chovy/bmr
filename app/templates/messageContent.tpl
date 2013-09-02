<div class="message-container">
    <a href="#" class="close">Close</a>
    <h3 class="subject">{{msg.subject}}</h3>
    {{#if isSentMessage}}
        <p class="date">{{msg.lastActionTime}}</p>
    {{else}}
        <p class="date">{{msg.receivedTime}}</p>
    {{/if}}
    <p data-from="{{msg.fromAddress}}" class="from">From: {{msg.fromAddress}}</p>
    <p data-to="{{msg.toAddress}}" class="to">To: {{msg.toAddress}}</p>
    <nav>
        {{#if isSentMessage}}
            <a href="#" class="add-address">Add to address book</a>
        {{else}}
            <a href="#" class="reply">Reply</a>
        {{/if}}
        <a href="#" class="trash">Trash</a>
    </nav>
    <section class="message">{{msg.message}}</section>
</div>