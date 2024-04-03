const exportedMethods = {

    validatePost(post) {
        if (!post) throw `Error: Post must be provided.`;
        if (typeof post !== 'string') throw `Error: Post must be of type string.`;
        post = post.trim();
        if (post.length === 0) throw `Error: Post cannot be empty or just spaces.`;
        return post;
    },

    validateTitle(title, limit){
        if (!title) throw `Error: Must include title!`;
        if (typeof title !== 'string') throw `Error: Title must of type string.`;
        title = title.trim();
        if (title.length === 0) throw `Error: Title cannot be empty or have only empty spaces.`;
        if (title.length > limit) throw `Error: Title cannot have more than ${limit} characters!`;
        return title;
    },

    validateTags(tags){
        if (!tags) throw `Error: Tags not provided.`;
        if (!Array.isArray(tags)) throw `Error: Must be of type Array.`;

        for(let i = 0; i < tags.length; i++) {
            if (typeof tags[i] !== 'string') throw `Error: Array must contain only strings.`;
            tags[i] = tags[i].trim();
            if(tags[i].length === 0) throw `Error: Tags in Array cannot be empty or just spaces.`;
        }

        return tags;
    }

};

export default exportedMethods;