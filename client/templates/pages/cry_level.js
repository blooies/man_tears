Template.cryLevel.events({
    'click #normal-btn': function() {
        Router.go('showCategories');
    },
    'click #power-cry-btn': function() {
        $('.custom-overlay').css("display", "block");
        $('.close-btn').css("display", "block");
        $('.done-crying-btn').css("display", "block");
        var randomContent = Content.findOne({level: "power"});
        var videoId = randomContent.videoId;
        var player;
        function onYouTubeIframeAPIReady() {
            player = new YT.Player('youtube-video', {
                height: '390',
                width: '640',
                videoId: videoId,
                events: {
                    'onReady': onPlayerReady,
                }
            });
        }

        function onPlayerReady(event) {
            event.target.playVideo();
        }

        onYouTubeIframeAPIReady();
    },
    'click .done-btn': function(e) {
        var className = e.target.className;
        $('.custom-overlay').css("display", "none");
        $('.close-btn').css("display", "none");
        $('.done-crying-btn').css("display", "none");
        var video = document.getElementById("youtube-video");
        var player = YT.get('youtube-video');
        if (video && video.src) {
            var timeSpentOnVideo = player.getCurrentTime();
            var userGoal = UserGoals.findOne({userId: Meteor.userId()});
            var minutes = userGoal.minutesCompleted;
            minutes += timeSpentOnVideo;
            var minutesCompleted = {minutesCompleted: minutes};
            Meteor.call('userGoalCreateOrUpdate', minutesCompleted, function(error, response) {
                console.log("finished updating", response)
                if (className.match("done-crying-btn")) {
                    Router.go('results');
                }
            })
            video.parentNode.removeChild(video);
            $('.youtube-container').append("<div id='youtube-video'></div>");
        }
    }
})
