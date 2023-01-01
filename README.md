## blogging website with Custom content management system

#### I Build it by using nextJs, typescript, prisma, postgresql db, supabase, tailwind, and material ui

## environment verbals
#### SECRET_KEY  (for json web token)
#### DATABASE_CONECTION_STRING (postgresql database)
#### SUPABASE_URL
#### SUPABASE_SECRET_KEY


## RESTFul API

##### => post "/auth/sing-up" // create an account and set cookie

##### => post "/auth/login" // set cookie

##### => get "/auth/logout" // remove cookie

##### => get "post" // get additional data required to create a post

##### => post "post" // create a post

##### => get "/admin/profile" // get your profile data

##### => patch "/admin/profile" // update profile information

##### => put "/admin/profile" // change blog name

##### => patch "/auth/sing-up" // change password

##### => post "comment" // make a comment on a post

##### => delete "comment?id=${id}" // delete comment by id

##### => patch "comment?id=${id}" // update comment by id

##### => patch "likes?type=like&id=${id}" // like a post by id

##### => patch "likes?type=dislike&id=${id}" // dislike a post by id

##### => get "search?search=${query}" // general search focused on title

##### => get "search?tag=${tag}" // search by tag

##### => get "search?category=${category}" // search by category

##### => get // "admin/?skip=${skip}&take=${take}" // admin posts table pagination

##### => get "admin/?length=true" // get length of posts admin table

##### => get "admin/update-post/?id=${id}" // get post additional data to update it

##### => post "admin/update-post/?id=${id}" // update post by id

##### => delete "post/?id=${id}" // delete post by id

##### => get "likes?id=${id}" // get likes and dislikes for post by postId

##### => get "comments?id=${id}" // get comments for post by postId

##### => get "posts/category=${category}&length=true" // get posts length after filter by category

##### => get "posts/category=${category}&skip=${skip}&take=${take}&sort=${sort}" // get posts sort them and filter them

##### => post "/upload" // upload profile image

##### => put "views/?id=${id}" // send request to server on any post page load to insure that this page had been viewed by user IP address (id is post id)


