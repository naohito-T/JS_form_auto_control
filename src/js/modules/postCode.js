import { NoPostCodeError } from './errorsClass';

export const postCode = () => {
  const head = document.getElementsByTagName('head'); // head tag road
  const script = document.createElement('script'); // script tag create
  script.setAttribute(
    // script tag option set
    'src',
    'https://cdn.jsdelivr.net/npm/fetch-jsonp@1.1.3/build/fetch-jsonp.min.js'
  );
  script.setAttribute('type', 'text/javascript'); // script tag option set
  document.head.appendChild(script);

  script.addEventListener('load', () => {
    const postcalSearchButton = document.getElementById('postcal_search');
    postcalSearchButton.addEventListener('click', () => {
      const api = 'https://zipcloud.ibsnet.co.jp/api/search?zipcode=';
      const postcal_code = document.getElementById('postcal_code');
      const address1 = document.getElementById('address1');
      const address2 = document.getElementById('address2');
      const address3 = document.getElementById('address3');
      const postParam = postcal_code.value.replace('-', '');
      const encodeUri = encodeURIComponent(postParam); // エンコード(単純な文字を文字コード化)
      const url = `${api}${encodeUri}`;

      const errorSpan = document.getElementById('post-error-message');
      // ES6
      // fetchJsonp(url, {
      //   timeout: 10000,
      // })
      //   .then((response) => {
      //     return response.json();
      //   })
      //   .then((data) => {
      //     if (data.status === 400) {
      //       errorSpan.textContent = data.message;
      //     } else if (data.results === null) {
      //       errorSpan.textContent = '郵便番号から住所が見つかりませんでした。';
      //     } else {
      //       address1.value = data.results[0].address1;
      //       address2.value = data.results[0].address2;
      //       address3.value = data.results[0].address3;
      //     }
      //   })
      //   .catch((ex) => {
      //     console.log(ex);
      //   });

      // ES8
      const fetchPostCode = async () => {
        const postCodeResponse = await fetchJsonp(url, {
          timeout: 10000,
        });
        if (postCodeResponse.ok) {
          const json = await postCodeResponse.json();
          if (!json.results) {
            errorSpan.textContent = '郵便番号から住所が見つかりませんでした。';
            throw new NoPostCodeError(
              '郵便番号から住所が見つかりませんでした。'
            );
          }
          return json;
        }
      };
      const postInit = async () => {
        try {
          const json = await fetchPostCode();
          address1.value = json.results[0].address1;
          address2.value = json.results[0].address2;
          address3.value = json.results[0].address3;
        } catch (e) {
          // alert(e); alertでもよい
          console.error(e);
        }
      };
      postInit();
    });
  });
};
