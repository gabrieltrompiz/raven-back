module.exports = {
    dbUrl: 'postgres://postgres:mastersword@localhost:5432/raven',
    port: 8080,

    //User Queries
    registerUser: 'INSERT INTO users (user_username, user_name, user_email, user_picture_url, user_password) VALUES ($1, $2, $3, $4, $5) RETURNING *;',
    login: 'SELECT * FROM users WHERE user_email = $1 AND user_password = $2',
    getUserById: 'SELECT user_id, user_name, user_email, user_picture_url FROM users WHERE user_id = $1;',
    getUserByEmail: 'SELECT * FROM users WHERE user_email = $1;',
    getUserByUsername: 'SELECT * FROM users WHERE user_username ILIKE $1',
    updateUser: 'UPDATE users SET user_name = $1, user_username = $2 WHERE user_id = $3;',
    updatePassword: 'UPDATE users SET user_password = $1 WHERE user_id = $2;',
    updatePicture: 'UPDATE users SET user_picture_url = $1 WHERE user_id = $2;',
    deleteUser: 'DELETE FROM users WHERE user_id = $1;',
    searchUser: 'SELECT * FROM users WHERE user_username ILIKE $1', //Search users with a given username using 'ILIKE'

    //Status Queries
    initializeStatus: 'INSERT INTO status (user_id, status_description) VALUES ($1, \'Available\') RETURNING *;', //Query to be called when an user is created
    getStatusList: 'SELECT status_id, status_description, is_active FROM status WHERE user_id = $1;',
    getStatusById: 'SELECT * FROM status WHERE status_id = $1',
    uploadStatus: 'UPDATE status SET is_active = FALSE WHERE status_id = $1;' +
        'INSERT INTO status (user_id, status_description) VALUES ($2, $3) RETURNING *;',
    updateStatus: 'UPDATE status SET is_active = FALSE WHERE status_id = $1;' +
        'UPDATE status SET is_active = TRUE WHERE status_id = $2;',
    deleteStatus: 'DO $do$ BEGIN IF EXISTS (SELECT * FROM status WHERE status_id = $1 AND is_active = FALSE)' +
        'THEN DELETE FROM status WHERE status_id = $1; END IF; END $do$',

    //Conversation Queries
    createConversation: 'INSERT INTO conversation (type_conversation_id, creator_id, conversation_name) VALUES ($1, $2, $3) RETURNING *;',
    insertUserToConversation: 'INSERT INTO conversation_users (user_id, type_user_id, conversation_id) VALUES ($1, $2, $3) RETURNING *;',
    removeUserFromConversation: 'DELETE FROM conversation_users WHERE conversation_user_id = $1;',
    getConversationUsers: 'SELECT * FROM conversation_users WHERE conversation_id = $1',
    getConversationList: 'SELECT cu.type_user_id, co.* FROM conversation_users cu INNER JOIN conversation co ' +
        'ON cu.conversation_id = co.conversation_id WHERE cu.user_id = $1;',
    getConversationById: 'SELECT * FROM conversation WHERE conversation_id = $1',
    getUserFromConversation: 'SELECT * FROM conversation_users WHERE conversation_id = $1 AND user_id = $2',
    searchConversation: 'SELECT cu.type_user_id, co.* FROM conversation_users cu INNER JOIN conversation co ' +
        'ON cu.conversation_id = co.conversation_id WHERE cu.user_id = $1 AND co.conversation_name ILIKE $2;',
    updateConversationName: 'UPDATE conversation SET conversation_name = $1 WHERE conversation_id = $2;',
    updateTypeUser: 'UPDATE conversation_users SET type_user_id = $1 WHERE conversation_user_id = $2;',
    deleteConversation: 'DELETE FROM conversation_users WHERE conversation_id = $1;' +
        'DELETE FROM message WHERE conversation_id = $1;' +
        'DELETE FROM conversation WHERE conversation_id = $1;',

    //Message Queries
    insertMessage: 'INSERT INTO message (user_id, conversation_id, message_attachment, message_body) VALUES ($1, $2, $3, $4) RETURNING *;',
    getMessageList: 'SELECT message_id, user_id, message_attachment, message_body, message_creation_date FROM message WHERE conversation_id = $1;',
    searchMessages: 'SELECT message_id, user_id, message_attachment, message_body, message_creation_date ' +
        'FROM message WHERE conversation_id = $1 AND message_body ILIKE \'%\'$2\'%\';',
    deleteMessage: 'DELETE FROM messages WHERE message_id = $1;',

    //App mailer
    emailName: 'Raven Support',
    emailUser: 'siulptt@gmail.com',
    emailPass: 'eresbella123'
};