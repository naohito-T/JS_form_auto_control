/**
 * @author naohito-T
 * @description error class modules
 * @use  使いたいクラスがexportできるためそれをimportする。
 * @memo export defaultをするとwebpackでerrorが吐かれる。
 */

// 値が設定されていない場合のカスタムエラー(mail)
export class NoDataError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NoDataError';
  }
}
// 郵便番号取得のカスタムエラー
export class NoPostCodeError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NoPostCodeError';
  }
}

export class NoSelectError extends Error {
  constructor(message) {
    console.log('NoSelectError');
    super(message);
    this.name = 'NoSelectError';
  }
}
