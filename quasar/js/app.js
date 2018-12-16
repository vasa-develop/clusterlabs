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

    if(window.location.search.split('?')[1].trim().length!=0){
        document.getElementById("query").value = decodeURI(window.location.href.split("?q=")[1].split("&")[0].split('%20metadata.Content-Type')[0]);
        
        search(window.location.search);
    }
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
        
        data.hits.forEach(element => {
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
        });
        if(result.trim().length==0){
            result = result + '<h5><span style="color:#8fa4b8;">No Results found for </span>'+window.location.search.split('q=')[1].split('&')[0].split('%')[0]+'</h5>';
        }
        result = result + "<hr>";
        document.getElementById("search_results").innerHTML = result;
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
            if(parseInt(cur_page)>0){
                var page = parseInt(window.location.search.split("page=")[1].split("&")[0])+1;
                window.location = "search.html?q=something&page="+page.toString();
            }
            else{
                window.location = "search.html?q=something&page=0";
            }
        }
    };