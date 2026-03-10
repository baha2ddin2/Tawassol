<?php


use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\dashboardController;
use App\Http\Controllers\Api\EmailController;
use App\Http\Controllers\Api\FollowController;
use App\Http\Controllers\Api\GroupeController;
use App\Http\Controllers\Api\hashtagController;
use App\Http\Controllers\Api\LikeController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\PasswordController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\reportController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Api\UserController;



Route::controller(AuthController::class)->group(function(){
    Route::post('/login', 'login');
    Route::post('/register','register');
});

Route::controller(PasswordController::class)->group(function(){
    Route::post('/password/forgot-password','forgotPassword');
    Route::post('/password/change-password','changePassword');
});

Route::middleware('jwt.cookie')->group(function () {

    Route::controller(AuthController::class)->group(function(){
        Route::post('/logout' ,'logout');
        Route::post('/check-auth', 'checkAuth');
    });

    Route::controller(PostController::class)->group(function(){
        Route::get('/profile-posts','profilePosts');
        Route::get('/profile-posts/{id}','userPost');
        Route::get('/post/{id}','showPost');
        Route::get('/feed','homePosts');
        Route::post('/post','createPost');
        Route::delete('/post/{id}','deletePost');
        Route::put('/post/{postId}','update');
    });

    Route::controller(UserController::class)->group(function(){
        Route::put('/changeEmail','updateEmail');
        Route::put('/changePassword','changePassword');
        Route::delete('/user','deleteUser');

    });

    Route::controller(ProfileController::class)->group(function(){
        Route::get('/profile','MyProfile');
        Route::get('/profile/{id}','ShowProfile');
        Route::put('/profile','updateProfile');
        Route::post('/avatar','updateAvatar');
        Route::put('/profile/changePrivacy','changePrivacy');
    });

    Route::controller(hashtagController::class)->group(function(){
        Route::get('/hashtag/{tag}','getPostsByHashtag');
        Route::get('/count-hashtag/{tag}','countAllPostsByHashtag');
        Route::get('/week-tendence','topHashtagsWeek');
    });

    Route::controller(LikeController::class)->group(function (){
        Route::post('/like-post/{postId}','likePost');
        Route::delete('like-post/{postId}','deslikePost');
        Route::post('/like-comment/{commentId}','likeComment');
        Route::delete('like-comment/{commentId}','deslikeComment');
    });

    Route::controller(CommentController::class)->group(function(){
        Route::post('/comment','createComment');
        Route::get('/comment/{postId}','showComments');
        Route::delete('/comment/{commentId}','deleteComment');
    });

    Route::controller(NotificationController::class)->group(function(){
        Route::get('/notifications','getNotifications');
        Route::get('/unread-count','unreadCount');
        Route::put('/mark-as-Read','markAsRead');
        Route::put('/mark-all-read','markAllAsRead');

    });

    Route::controller(SearchController::class)->group(function(){
        Route::get('/search','search');
        Route::get('/search-results','searchResults');
        Route::get('/search-results/post','postsResults');
        Route::get('/search-results/profile','profilesResult');
    });

    Route::controller(FollowController::class)->group(function(){
        Route::get('/following','getFollowing');
        Route::get('/followers','getFollowers');
        Route::get('/suggestions','suggestions');
        Route::post('/follow/{userId}','follow');
        Route::delete('/unfollow/{userId}','unfollow');
    });

    Route::controller(MessageController::class)->group(function(){
        Route::get('/contacts','contactsFull');
        Route::get('/unread_messages','unreadMessagesCount');
        Route::get('/conversation/{userId}','conversation');
    });

    Route::controller(GroupeController::class)->group(function(){
        Route::get('/group/conersation/{groupId}','conversation');
        Route::post('/group','createGroup');
        Route::post('/group/add-membes/{$groupId}','addGroupMembers');
        Route::get('/group/available-members','getAvailableMembers');
        Route::put('/group/{groupId}','updateGroup');
        Route::get('/group/{groupId}','getGroupDetails');
        
    });

    Route::controller(EmailController::class)->group(function(){
        Route::post('/email/send-code','sendCode');
        Route::post('/email/verify-email','verifyEmail');

    });

    Route::controller(dashboardController::class)->group(function(){
        Route::get('/dashboard/reports','getAllReports');
        Route::get('/dashboard/reports/{reportId}','getReport');
        Route::put('/dashboard/reports/{reportId}','handleReport');
        Route::get('/dashboard/count','count');
        Route::get('/dashboard/users','users');
        Route::delete('/dashboard/users/{userId}','deleteUser');

    });

    Route::controller(reportController::class)->group(function(){
        Route::post('/report/post/{postId}','reportPost');
        Route::post('/report/comment/{commentId}','reportComment');
        Route::post('/report/user/{userId}','reportUser');
        Route::get('/report','myReports');
    });

});