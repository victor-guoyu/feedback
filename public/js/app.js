UserVoice = window.UserVoice || [];

/**
 * Identify the user and pass traits
 * To enable, replace sample data with actual user traits and uncomment the line
 */
UserVoice.push([
    'identify', {
        //email:      'john.doe@example.com', // User’s email address
        //name:       'John Doe', // User’s real name
        //created_at: 1364406966, // Unix timestamp for the date the user signed up
        //id:         123, // Optional: Unique id of the user (if set, this should not change)
        //type:       'Owner', // Optional: segment your users by type
        //account: {
        //  id:           123, // Optional: associate multiple users with a single account
        //  name:         'Acme, Co.', // Account name
        //  created_at:   1364406966, // Unix timestamp for the date the account was created
        //  monthly_rate: 9.99, // Decimal; monthly rate of the account
        //  ltv:          1495.00, // Decimal; lifetime value of the account
        //  plan:         'Enhanced' // Plan name for the account
        //}

    }
]);

// Set global widget options
UserVoice.push([
    'set', {
        mode: 'satisfaction',
        accent_color: '#448dd6',
        trigger_color: 'white',
        trigger_background_color: '#448dd6',
    }
]);

UserVoice.push(['addTrigger']);
UserVoice.push(['show']);
		
UserVoice.push(['embed', '#SmartVoteEmbedWidget', {
  mode: 'smartvote',
  forum_id: '289798',
  height: '325px',
  width: '325px'
}]);

UserVoice.push(['embed', '#ContactEmbedWidget', {
  mode: 'contact',
  height: '325px',
  width: '325px'
}]);

UserVoice.push(['embed', '#SatisfactionEmbedWidget', {
  mode: 'satisfaction',
  height: '325px',
  width: '325px'
}]);