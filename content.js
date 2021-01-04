let videos = document.getElementsByTagName('video');
let top_bar = document.getElementsByClassName('top-bar');
let prev_vid_count = 0

createCSS();	//blah blah use a self executing function blah. I dont care it's fine.

//Create and add CSS for secondary (mini) player controls so volume can be adjusted
function createCSS(){
    style = document.createElement('style')
    head  = document.head || document.getElementsByTagName('head')[0]
    css = `video::-webkit-media-controls-timeline{
        display: none;
    }
    video::-webkit-media-controls-time-remaining-display{
        display: none;
    }
    video::-webkit-media-controls-current-time-display{
        display: none;
    }`
    head .appendChild(style)
    style.type = 'text/css'
    if (style.styleSheet){
        style.styleSheet.cssText = css;
    }else{
        style.appendChild(document.createTextNode(css))
    }
}

//could use a mutation observer, but the performance impact of one loop checking the 'video' tag dymanic html collection is minimal.
let loop = setInterval(()=>{
    if(videos.length > 1){										//ad is playing and stream is playing in miniplayer
    	chrome.storage.local.get({muteAll: true}, function(data) {
        	videos[0].muted = top_bar.length > 0 ? false : data.muteAll; 	//volume resets to 100% on ever new ad in a break but doesn't reflect it in the UI otherwise volume wont be able to be adjusted
 		});
        if(prev_vid_count === 1){								//run only the first time miniplayer opens otherwise volume wont be able to be adjusted
            videos[1].muted = false;
            videos[1].controls = true;
            videos[1].volume = 0.5;
            prev_vid_count = videos.length;
        }
	}else if(videos.length == 1 && top_bar.length == 0){		//detect preroll Ad
		chrome.storage.local.get({muteAll: true}, function(data) {
			videos[0].muted = data.muteAll;	
		})	
		prev_vid_count = 0;
	}else if(videos.length == 1 && top_bar.length > 0){			//stream playing normally
		if (prev_vid_count != 1){
			videos[0].muted = false;
			prev_vid_count = 1
		}
	}
}, 1000);


