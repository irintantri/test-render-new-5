COMPONENT CommentPanel:
    STATE comments = useFetchComments(documentId)
    STATE openCommentCount = calculateOpenComments(comments)

    RENDER:
        // Scrollable list of comment cards
        FOR EACH comment IN comments:
            RENDER CommentCard(comment)
        
        // Pinned composer at the bottom
        RENDER CommentComposer(onAdd: handleAddComment)

COMPONENT CommentCard(comment):
    RENDER:
        Display sectionLabel, authorAvatar, authorName, timePosted, commentBody
        
        // Status Toggle
        SELECT status:
            OPTION "Open", "Resolved", "Closed"
            ON CHANGE: call API PATCH /api/comments/{comment.id}/status
        
        // Reply Section
        DISPLAY replyCount
        BUTTON "Reply" ON CLICK: toggleReplyForm()
        IF replyFormVisible:
            RENDER InlineReplyForm(parentId: comment.id)
        
        // Nested Replies
        FOR EACH reply IN comment.replies:
            RENDER ReplyItem(reply)