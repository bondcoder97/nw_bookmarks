const fs = require('fs').promises;

class Bookmarks{
    constructor(options={}){
        const {data_path,filename="bookmarks.txt"} = options;
        this.data_path = data_path;
        this.filename = filename;
        this.bookmark_filepath = `${data_path}/${filename}`;
    }


    async get_bookmarks(){
        try{
            const raw_bookmarks = await fs.readFile(this.bookmark_filepath, {encoding: "utf-8"});
            const bookmarks = this.extract_bookmarks(raw_bookmarks);
            return bookmarks;
        }
        catch(err){
          console.log(err);
          return [];
        }

    }

    async is_exist(url){
        try{
            if(!url) throw new Error("Wrong params!");
            const bookmarks = await this.get_bookmarks();
            const current_bookmark = bookmarks.find((bookmark) => bookmark === url);
            if(current_bookmark) return true;
            return false;
        }
        catch(err){
          console.log(err);
        }
    }


    async add(url){
        try{
            if(!url) throw new Error("Wrong params!");
            if(await this.is_exist(url)) throw new Error("Bookmark with such URL already exists!");
            await fs.appendFile(this.bookmark_filepath, `${url}\n`);
        }
        catch(err){
          console.log(err);
        }
    }


    to_text(bookmarks_list){
        let result = "";
        if(!bookmarks_list.length) return result;
        bookmarks_list.map((bookmark)=>{
            result += `${bookmark}\n`;
        });
        return result;
    }

    //extract bookmarks info from raw text
    extract_bookmarks(raw_text){
        if(!raw_text) return [];
        const rows = raw_text.split("\n");        
        const result = [];
        rows.map((row)=>{
            if(!row) return;
            result.push(row);               
        });
        return result;
    }
    
}


module.exports = Bookmarks;