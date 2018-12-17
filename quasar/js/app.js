appLoading.start();

    //aligning search bar according to client device
    if(window.navigator.userAgent.includes("Android") || window.navigator.userAgent.includes("iPhone")){
        document.getElementById("search-bar").style = "padding-left:20px;padding-right:20px;padding-top:20px;";
    }
    else{
        document.getElementById("search-bar").style = "padding-left:40px;padding-right:20px;padding-top:20px;";
    }

    //setting page number
    if(typeof(window.location.search.split("page=")[1])!="undefined"){
        document.getElementById("page_no").innerHTML = window.location.search.split("page=")[1].split("&")[0];
    }else{
        document.getElementById("page_no").innerHTML = 0;
    }

    //highlighting the search type
    if(window.location.href.includes("metadata.Content-Type%3Atext")){
        //highlight text
        document.getElementById("text").color="#3b3be8";
    }
    else if(window.location.href.includes("metadata.Content-Type%3Aaudio")){
        //highlight audio
        document.getElementById("audio").color="#3b3be8";
    }
    else if(window.location.href.includes("metadata.Content-Type%3Avideo")){
        //highlight video
        document.getElementById("video").color="#3b3be8";
    }
    else if(window.location.href.includes("metadata.Content-Type%3Aimage")){
        //highlight image
        document.getElementById("image").color="#3b3be8";
    }
    else{
        //highlight all
        document.getElementById("all").color="#3b3be8";
    }


    if(window.location.search.split('?')[1].trim().length!=0){
        document.getElementById("query").value = decodeURI(window.location.href.split("?q=")[1].split("&")[0].split('%20metadata.Content-Type')[0]);
        
        search(window.location.search);
    }

    //event listener for enter key for search
    document.addEventListener('keydown', function(event) {
      if (event.keyCode == 13) {
        if(document.getElementById("query").value.trim().length!=0){
            window.location.href = "search.html?q="+document.getElementById("query").value.trim()+"&page=0";
        }
      }
    });

    //Search button listener
    document.getElementById("search").onclick=()=>{
        window.location.href = "search.html?q="+document.getElementById("query").value.trim()+"&page=0";
    }

    //All search category listener
    document.getElementById("all").onclick=()=>{
        window.location.href = "search.html?q="+document.getElementById("query").value.trim()+"&page=0";
    }

    //images search category listener
    document.getElementById("image").onclick=()=>{
        window.location.href = "search.html?q="+document.getElementById("query").value.trim()+"%20metadata.Content-Type%3Aimage*&page=0&_type=file";
    }

    //video search category listener
    document.getElementById("video").onclick=()=>{
        window.location.href = "search.html?q="+document.getElementById("query").value.trim()+"%20metadata.Content-Type%3Avideo*&page=0&_type=file";
    }

    //audio search category listener
    document.getElementById("audio").onclick=()=>{
        window.location.href = "search.html?q="+document.getElementById("query").value.trim()+"%20metadata.Content-Type%3Aaudio*&page=0&_type=file";
    }

    //text search category listener
    document.getElementById("text").onclick=()=>{
        window.location.href = "search.html?q="+document.getElementById("query").value.trim()+"%20metadata.Content-Type%3Atext*&page=0&_type=file";
    }

    function search(query){
        $.ajax({
            url: "https://api.ipfscloud.store/search/"+query,
            type: "GET",
            success: function (data) {
              document.getElementById("total_results").innerHTML = data["total"]+" results found in "+data["page_count"]+" page(s)";
              appLoading.stop();
              display(data);
            },
            error: function(xhr, ajaxOptions, thrownError){
              appLoading.stop();
              console.log("email error: "+thrownError);
            }
            });
    }

    

    function display(data){
        var result = "";
        var safesearch=false;
        var block_count = 0;

        data.hits.forEach(element => {

            if(passes_safesearch(element)){
            result = result + "<div class='card'><a target='_blank' href=\"https://gateway.ipfs.io/ipfs/"+element['hash']+"\"><div class='card-body'><h5 class='card-title'>"+element['title']+"</h5>";
            if(typeof(element['first-seen'])!="undefined"){
                var d = new Date(element['first-seen']);
                result = result + "<small style='color:#8fa4b8;'>"+d.toDateString()+"</small><br>";
            }
            if(element['description']!=null){
                result = result + "<small class='card-text'>"+element['description']+"</small><br>";
            }
            if(typeof(element['mimetype'])!="undefined"){
                result = result + "<small style='color:#8fa4b8;'>"+element['mimetype']+"</small>";
            }
            result = result + '</div></a></div><br><br>';
        }
        else{
            block_count = block_count + 1;
            if(!safesearch){
                safesearch = true;
            }
        }
        });
        if(result.trim().length==0){
            result = result + '<h5><span style="color:#8fa4b8;">No Results found for </span>'+decodeURI(window.location.search.split('q=')[1].split('&')[0].split('%20metadata.Content-Type')[0])+'</h5>';
        }
        result = result + "<hr>";
        document.getElementById("search_results").innerHTML = result;

        //adding safesearch warning
        if(safesearch){
            document.getElementById("total_results").innerHTML = document.getElementById("total_results").innerHTML + '<br><font color="green">Safe Search Activated ('+block_count+' result(s) blocked)</font>';
        }
    }

    document.getElementById("bottom_previous_page").onclick = ()=>{
        var cur_page = window.location.search.split("page=")[1].split("&")[0];
        if(cur_page){
            if(parseInt(cur_page)>0){
                var page = parseInt(window.location.search.split("page=")[1].split("&")[0])-1;
                window.location = "search.html?q=something&page="+page.toString();
            }
            else{
                window.location = "search.html?q=something&page=0";
            }
        }
    };

    

    document.getElementById("bottom_next_page").onclick = ()=>{
        var cur_page = window.location.search.split("page=")[1].split("&")[0];
        if(cur_page){
            if(parseInt(cur_page)>=0){
                var page = parseInt(window.location.search.split("page=")[1].split("&")[0])+1;
                window.location = "search.html?q=something&page="+page.toString();
            }
            else{
                window.location = "search.html?q=something&page=0";
            }
        }
    };

    //email sender
    function sendEmail(){
        var email_body={
            to: document.getElementById("email").value,
            subject: "Quasar Update",
            body: "You have been added to Quasar group. You will be notified whenever we are online :)"
        };
            $.ajax({
            url: "https://api.ipfscloud.store/email",
            type: "POST",
            data: email_body,
            contentType: 'application/x-www-form-urlencoded',
            success: function (data) {
                console.log(data);
                document.getElementById("email_status").color = "green";
                document.getElementById("email_status").innerHTML = '<font>✓ You will now recieve updates from '+project+'</font>';
            },
            error: function(xhr, ajaxOptions, thrownError){
                console.log("email error: "+thrownError);
                document.getElementById("email_status").color = "red";
                document.getElementById("email_status").innerHTML = '<font>Some error occured! Please try Again.</font>';            
            }
            });
    }
    
    function passes_safesearch(element){
        
        if(element['description']){
            if(element['description'].toLocaleLowerCase().includes("aMule".toLocaleLowerCase()) || element['description'].toLocaleLowerCase().includes("Firsthair".toLocaleLowerCase()) ||
            element['description'].toLocaleLowerCase().includes("<em>fuck</em> who".toLocaleLowerCase()) || 
            (
                (
                element['description'].toLocaleLowerCase().includes("teen".toLocaleLowerCase()) ||
                element['description'].toLocaleLowerCase().includes("child".toLocaleLowerCase()) ||
                element['description'].toLocaleLowerCase().includes("young".toLocaleLowerCase())
                )
                && 
                
                (element['description'].toLocaleLowerCase().includes("fuck".toLocaleLowerCase()) ||
                element['description'].toLocaleLowerCase().includes("pussy".toLocaleLowerCase()) ||
                element['description'].toLocaleLowerCase().includes("sex".toLocaleLowerCase()) ||
                element['description'].toLocaleLowerCase().includes("slave".toLocaleLowerCase()) ||
                element['description'].toLocaleLowerCase().includes("porn".toLocaleLowerCase()) ||
                element['description'].toLocaleLowerCase().includes("molest".toLocaleLowerCase()) ||
                element['description'].toLocaleLowerCase().includes("sex".toLocaleLowerCase()) ||
                element['description'].toLocaleLowerCase().includes("abuse".toLocaleLowerCase())||
                element['description'].toLocaleLowerCase().includes("kill".toLocaleLowerCase()) ||
                element['description'].toLocaleLowerCase().includes("murder".toLocaleLowerCase()) ||
                element['description'].toLocaleLowerCase().includes("rape".toLocaleLowerCase())
                )
                &&(
                    !element['description'].toLocaleLowerCase().includes("care".toLocaleLowerCase()) && !element['description'].toLocaleLowerCase().includes("law".toLocaleLowerCase())
                    && !element['description'].toLocaleLowerCase().includes("protect".toLocaleLowerCase())
                    && !element['description'].toLocaleLowerCase().includes("parent".toLocaleLowerCase())
                    && !element['description'].toLocaleLowerCase().includes("foundation".toLocaleLowerCase())
                    && !element['description'].toLocaleLowerCase().includes("educat".toLocaleLowerCase())
                    && !element['description'].toLocaleLowerCase().includes("love".toLocaleLowerCase())
                )
            ) 
            
            ){
                return false;
            }
        }
        if(element['title'].toLocaleLowerCase().includes("aMule".toLocaleLowerCase()) || element['title'].toLocaleLowerCase().includes("Firsthair".toLocaleLowerCase()) || 
        (

        (
            element['title'].toLocaleLowerCase().includes("teen".toLocaleLowerCase()) ||
            element['title'].toLocaleLowerCase().includes("child".toLocaleLowerCase()) ||
            element['title'].toLocaleLowerCase().includes("young".toLocaleLowerCase())
        )
            && 
            (element['title'].toLocaleLowerCase().includes("fuck".toLocaleLowerCase()) ||
            element['title'].toLocaleLowerCase().includes("pussy".toLocaleLowerCase()) ||
            element['title'].toLocaleLowerCase().includes("sex".toLocaleLowerCase()) ||
            element['title'].toLocaleLowerCase().includes("slave".toLocaleLowerCase()) ||
            element['title'].toLocaleLowerCase().includes("porn".toLocaleLowerCase()) ||
            element['title'].toLocaleLowerCase().includes("molest".toLocaleLowerCase()) ||
            element['title'].toLocaleLowerCase().includes("sex".toLocaleLowerCase()) ||
            element['title'].toLocaleLowerCase().includes("abuse".toLocaleLowerCase()) ||
            element['title'].toLocaleLowerCase().includes("kill".toLocaleLowerCase()) ||
            element['title'].toLocaleLowerCase().includes("murder".toLocaleLowerCase()) || element['title'].toLocaleLowerCase().includes("rape".toLocaleLowerCase()) 
            )
            &&(
                !element['title'].toLocaleLowerCase().includes("care".toLocaleLowerCase()) && !element['title'].toLocaleLowerCase().includes("law".toLocaleLowerCase())
                && !element['title'].toLocaleLowerCase().includes("protect".toLocaleLowerCase())
                && !element['title'].toLocaleLowerCase().includes("parent".toLocaleLowerCase())
                    && !element['title'].toLocaleLowerCase().include("foundation".toLocaleLowerCase())&& !element['title'].toLocaleLowerCase().includes("educat".toLocaleLowerCase())
                    && !element['title'].toLocaleLowerCase().includes("love".toLocaleLowerCase())
            )

        )
        ){
            return false;
        }
        return true;
    }