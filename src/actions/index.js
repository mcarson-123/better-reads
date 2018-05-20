import { parseString } from 'xml2js';
import axios from 'axios';
import { each } from 'lodash';
import moment from 'moment';

const URL = `/review/list?v=2&id=6754163&shelf=on-cloud&key=${__API_KEY__}&per_page=10`

// The values are the sort parameter values expected
// by the Goodreads API
export const SORT = {
  AUTHOR: 'author',
  RATING: 'avg_rating',
  DATE_PUB: 'date_pub',
};

export const BOOKS_FETCHED = 'books_fetched';
export const BOOKS_TOTAL_FETCHED = 'books_total_fetched';

/*
  Sadly XML is a pain to parse. I couldn't find any great libraries to
  make this easier, so the code to extrapolate data from the xml response
  is not very satisfying.
  Libraries looked at: xml2js, xml-parser, react-xml-parser, xml2json
*/
function parseXML(xmlString) {
  return new Promise((resolve, reject) => {
    parseString(xmlString, (err, result) => {
      if (err) reject(err);
      else {
        resolve(extrapolateDataFromXml(result))
      };
    });
  });
}

/*
  Structure:
  {
    <book_id>: { // id
      title: <title>,
      authors: [<author1name>, <author2name>, .... <authorNname>],
      average_rating: <average_rating>,
      pub_date: <publication_day-publication_month-publication_year>,
      image_url: <image_url>,
      description: <description>,
    }
  }
*/
function extrapolateDataFromXml(xmlObj) {
  // This extrapolation is very ugly :sadpanda:
  const total = xmlObj.GoodreadsResponse.reviews[0].$.total;
  const reviews = xmlObj.GoodreadsResponse.reviews[0].review;

  const objForState = {}
  each(reviews, function(review) {
    const bookData = review.book[0];
    objForState[review.id[0]] = {
      id: review.id[0],
      title: bookData.title[0],
      average_rating: bookData.average_rating[0],
      image_url: bookData.image_url[0],
      description: bookData.description[0],
      published_day: getDayFromParts(
        bookData.publication_day[0],
        bookData.publication_month[0],
        bookData.publication_year[0]
      ),
      authors: formatAuthorsFromXML(bookData.authors)
    }
  });
  return [total, objForState];
}

function getDayFromParts(day, month, year) {
  return moment(
    `${String(year)}-${String(month)}-${String(day)}`,
    ['YYYY-MM-DD']
  );
}

function formatAuthorsFromXML(authorsXML) {
  var authors = [];
  each(authorsXML, function(author, index) {
    authors.push(author.author[0].name[0]);
  })
  return authors;
}

// /*
//   Used for testing xml parsing without having to hit the api every time.
// */
// export function fetchBooks(pageNumber = 1) {
//   return (dispatch) => {
//     parseXML(bookXML)
//     .then(parsedData => {
//       dispatch(fetchBooksSuccess(parsedData[1]));
//       dispatch(fetchBooksTotalSuccess(parsedData[0]));
//     });
//   }
// }

export function fetchBooks(pageNumber = 1, sort = SORT.AUTHOR) {
  const queryURL = `${URL}&page=${pageNumber}&sort=${sort}`
  return (dispatch) => {
    var books = [];
    axios.get(queryURL)
      .then((res) => parseXML(res.data))
      .then((parsedData) => {
        dispatch(fetchBooksSuccess(parsedData[1]));
        dispatch(fetchBooksTotalSuccess(parsedData[0]));
      });
  }
}

function fetchBooksSuccess(books){
  return {
    type: BOOKS_FETCHED,
    payload: books,
  }
}

function fetchBooksTotalSuccess(booksTotal){
  return {
    type: BOOKS_TOTAL_FETCHED,
    payload: booksTotal,
  }
}

const bookXML =
      `<?xml version="1.0" encoding="UTF-8"?>
<GoodreadsResponse>
   <Request>
      <authentication>true</authentication>
      <key><![CDATA[<my-api-key>]]></key>
      <method><![CDATA[review_list]]></method>
   </Request>
   <shelf exclusive="false" id="216167179" name="on-cloud" sortable="false" />
   <reviews start="1" end="3" total="149">
      <review>
         <id>2047743428</id>
         <book>
            <id type="integer">26065653</id>
            <isbn>1471143589</isbn>
            <isbn13>9781471143588</isbn13>
            <text_reviews_count type="integer">53</text_reviews_count>
            <uri>kca://book/amzn1.gr.book.v1.bf3Bxzgz54rDV04EhMkypA</uri>
            <title>Royal Tour (Potion, #2)</title>
            <title_without_series>Royal Tour</title_without_series>
            <image_url>https://images.gr-assets.com/books/1465820249m/26065653.jpg</image_url>
            <small_image_url>https://images.gr-assets.com/books/1465820249s/26065653.jpg</small_image_url>
            <large_image_url />
            <link>https://www.goodreads.com/book/show/26065653-royal-tour</link>
            <num_pages>372</num_pages>
            <format>Paperback</format>
            <edition_information />
            <publisher>Simon &amp; Schuster Children's UK</publisher>
            <publication_day>11</publication_day>
            <publication_year>2016</publication_year>
            <publication_month>8</publication_month>
            <average_rating>4.00</average_rating>
            <ratings_count>596</ratings_count>
            <description>&lt;b&gt;Stolen memories, a lost diary and a race against time...&lt;/b&gt;&lt;br /&gt;&lt;br /&gt;Having saved Princess Evelyn (and become her new BFF) Sam must accompany Evelyn on a world tour, so she can keep the princess (and everyone around her) safe with a power-binding potion. But Sam also has another reason to scour the globe. Someone has tampered with her grandad's mind, and Sam is the only one who can unlock his memories to save him and the family business. And that's not all that's at stake. The stolen memories contain the recipe to a potion which many would kill to get hold of. With the post powerful people in the world desperate for the recipe, Sam must save her grandad in order to save everyone else...</description>
            <authors>
               <author>
                  <id>8343775</id>
                  <name>Amy Alward</name>
                  <role />
                  <image_url nophoto="false"><![CDATA[https://images.gr-assets.com/authors/1421179094p5/8343775.jpg]]></image_url>
                  <small_image_url nophoto="false"><![CDATA[https://images.gr-assets.com/authors/1421179094p2/8343775.jpg]]></small_image_url>
                  <link><![CDATA[https://www.goodreads.com/author/show/8343775.Amy_Alward]]></link>
                  <average_rating>3.82</average_rating>
                  <ratings_count>3817</ratings_count>
                  <text_reviews_count>714</text_reviews_count>
               </author>
            </authors>
            <published>2016</published>
            <work>
               <id>46001014</id>
               <uri>kca://work/amzn1.gr.work.v1.APPcdvClA60JYO5qsiyPfQ</uri>
            </work>
         </book>
         <rating>0</rating>
         <votes>0</votes>
         <spoiler_flag>false</spoiler_flag>
         <spoilers_state>none</spoilers_state>
         <shelves>
            <shelf exclusive="true" id="22289196" name="to-read" review_shelf_id="1701668727" sortable="true" />
            <shelf exclusive="false" id="216167179" name="on-cloud" review_shelf_id="1701668766" sortable="false" />
         </shelves>
         <recommended_for />
         <recommended_by />
         <started_at />
         <read_at />
         <date_added>Sun Jul 02 21:34:45 -0700 2017</date_added>
         <date_updated>Sun Jul 02 21:34:49 -0700 2017</date_updated>
         <read_count>0</read_count>
         <body />
         <comments_count>0</comments_count>
         <url><![CDATA[https://www.goodreads.com/review/show/2047743428]]></url>
         <link><![CDATA[https://www.goodreads.com/review/show/2047743428]]></link>
         <owned>0</owned>
      </review>
      <review>
         <id>2047742587</id>
         <book>
            <id type="integer">30653880</id>
            <isbn>0062380788</isbn>
            <isbn13>9780062380784</isbn13>
            <text_reviews_count type="integer">325</text_reviews_count>
            <uri>kca://book/amzn1.gr.book.v1.iWEQJpRqI0i9N-r9oXwHGA</uri>
            <title>The Ship Beyond Time (The Girl From Everywhere, #2)</title>
            <title_without_series>The Ship Beyond Time</title_without_series>
            <image_url>https://images.gr-assets.com/books/1481278349m/30653880.jpg</image_url>
            <small_image_url>https://images.gr-assets.com/books/1481278349s/30653880.jpg</small_image_url>
            <large_image_url />
            <link>https://www.goodreads.com/book/show/30653880-the-ship-beyond-time</link>
            <num_pages>456</num_pages>
            <format>Hardcover</format>
            <edition_information />
            <publisher>Greenwillow Books</publisher>
            <publication_day>28</publication_day>
            <publication_year>2017</publication_year>
            <publication_month>2</publication_month>
            <average_rating>3.89</average_rating>
            <ratings_count>1847</ratings_count>
            <description>&lt;i&gt;Some things should not be stolen.&lt;/i&gt;&lt;br /&gt;&lt;br /&gt;After what seems like a lifetime of following her father across the globe and through the centuries, Nix has finally taken the helm of their time-traveling ship. Her future—and the horizon—is bright.&lt;br /&gt;&lt;br /&gt;Until she learns she is destined to lose the one she loves. To end up like her father: alone, heartbroken.&lt;br /&gt;&lt;br /&gt;Unable to face losing Kashmir—best friend, thief, charmer extraordinaire—Nix sails her crew to a mythical utopia to meet a man who promises he can teach her how to manipulate time, to change history. But no place is perfect, not even paradise. And everything is constantly changing on this utopian island, including reality itself.&lt;br /&gt;&lt;br /&gt;If Nix can read the ever-shifting tides, perhaps she will finally harness her abilities. Perhaps she can control her destiny, too.&lt;br /&gt;&lt;br /&gt;Or perhaps her time will finally run out.</description>
            <authors>
               <author>
                  <id>8167946</id>
                  <name>Heidi Heilig</name>
                  <role />
                  <image_url nophoto="false"><![CDATA[https://images.gr-assets.com/authors/1422212874p5/8167946.jpg]]></image_url>
                  <small_image_url nophoto="false"><![CDATA[https://images.gr-assets.com/authors/1422212874p2/8167946.jpg]]></small_image_url>
                  <link><![CDATA[https://www.goodreads.com/author/show/8167946.Heidi_Heilig]]></link>
                  <average_rating>3.72</average_rating>
                  <ratings_count>10577</ratings_count>
                  <text_reviews_count>2309</text_reviews_count>
               </author>
            </authors>
            <published>2017</published>
            <work>
               <id>46168634</id>
               <uri>kca://work/amzn1.gr.work.v1.oBBWjE0gmILF17tY09FIxQ</uri>
            </work>
         </book>
         <rating>0</rating>
         <votes>0</votes>
         <spoiler_flag>false</spoiler_flag>
         <spoilers_state>none</spoilers_state>
         <shelves>
            <shelf name="read" exclusive="true" id="22289198" review_shelf_id="" />
            <shelf exclusive="false" id="216167179" name="on-cloud" review_shelf_id="1701667969" sortable="false" />
         </shelves>
         <recommended_for />
         <recommended_by />
         <started_at />
         <read_at />
         <date_added>Sun Jul 02 21:33:30 -0700 2017</date_added>
         <date_updated>Fri Aug 04 22:18:46 -0700 2017</date_updated>
         <read_count>1</read_count>
         <body />
         <comments_count>0</comments_count>
         <url><![CDATA[https://www.goodreads.com/review/show/2047742587]]></url>
         <link><![CDATA[https://www.goodreads.com/review/show/2047742587]]></link>
         <owned>0</owned>
      </review>
      <review>
         <id>2046361594</id>
         <book>
            <id type="integer">35453424</id>
            <isbn nil="true" />
            <isbn13 nil="true" />
            <text_reviews_count type="integer">18</text_reviews_count>
            <uri>kca://book/amzn1.gr.book.v1.h-eJPkKIl5CH102lbessxQ</uri>
            <title>Swimming Home: A Novel</title>
            <title_without_series>Swimming Home: A Novel</title_without_series>
            <image_url>https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png</image_url>
            <small_image_url>https://s.gr-assets.com/assets/nophoto/book/50x75-a91bf249278a81aabab721ef782c4a74.png</small_image_url>
            <large_image_url />
            <link>https://www.goodreads.com/book/show/35453424-swimming-home</link>
            <num_pages />
            <format />
            <edition_information />
            <publisher />
            <publication_day />
            <publication_year />
            <publication_month />
            <average_rating>3.64</average_rating>
            <ratings_count>302</ratings_count>
            <description>&lt;b&gt;From the author of the international bestseller &lt;i&gt;In Falling Snow&lt;/i&gt;, a beautifully written, heartwarming novel of a young woman swimmer in 1925    &lt;/b&gt;&lt;br /&gt;  &lt;br /&gt; London 1925: Fifteen-year-old Catherine Quick longs to feel once more the warm waters of her home, to strike out into the ocean off the Torres Strait Islands in Australia and swim, as she’s done since she was a child. But now, orphaned and living with her aunt Louisa in London, Catherine feels that everything she values has been stripped away from her.&lt;br /&gt;  &lt;br /&gt; Louisa, a London surgeon who fought boldly for equality for women, holds strict views on the behavior of her young niece. She wants Catherine to pursue an education, just as she herself did.  Catherine is rebellious, and Louisa finds it difficult to block painful memories from her past. It takes the enigmatic American banker Manfred Lear Black to convince Louisa to bring Catherine to New York where Catherine can train to become the first woman to swim the English Channel. And finally, Louisa begins to listen to what her own heart tells her.&lt;br /&gt;&lt;br /&gt;&lt;br /&gt;&lt;i&gt;From the Trade Paperback edition.&lt;/i&gt;</description>
            <authors>
               <author>
                  <id>1596534</id>
                  <name>Mary-Rose MacColl</name>
                  <role />
                  <image_url nophoto="false"><![CDATA[https://images.gr-assets.com/authors/1349374842p5/1596534.jpg]]></image_url>
                  <small_image_url nophoto="false"><![CDATA[https://images.gr-assets.com/authors/1349374842p2/1596534.jpg]]></small_image_url>
                  <link><![CDATA[https://www.goodreads.com/author/show/1596534.Mary_Rose_MacColl]]></link>
                  <average_rating>3.83</average_rating>
                  <ratings_count>3020</ratings_count>
                  <text_reviews_count>475</text_reviews_count>
               </author>
            </authors>
            <published />
            <work>
               <id>45814530</id>
               <uri>kca://work/amzn1.gr.work.v1.VUFWXzjNVM8BwZ-J_7_pwg</uri>
            </work>
         </book>
         <rating>0</rating>
         <votes>0</votes>
         <spoiler_flag>false</spoiler_flag>
         <spoilers_state>none</spoilers_state>
         <shelves>
            <shelf exclusive="true" id="22289196" name="to-read" review_shelf_id="1700315313" sortable="true" />
            <shelf exclusive="false" id="216167179" name="on-cloud" review_shelf_id="1701666542" sortable="false" />
         </shelves>
         <recommended_for />
         <recommended_by />
         <started_at />
         <read_at />
         <date_added>Sat Jul 01 13:48:45 -0700 2017</date_added>
         <date_updated>Sun Jul 02 21:31:20 -0700 2017</date_updated>
         <read_count>0</read_count>
         <body />
         <comments_count>0</comments_count>
         <url><![CDATA[https://www.goodreads.com/review/show/2046361594]]></url>
         <link><![CDATA[https://www.goodreads.com/review/show/2046361594]]></link>
         <owned>0</owned>
      </review>
   </reviews>
</GoodreadsResponse>`
