import React, { Component } from 'react'

export default class NewsItem extends Component {

  render() {
    let {title, description, imageUrl,newsUrl, author, date, source}=this.props;
    return (
      <div className="my-3">
        <div className="card">
        <span className="position-absolute top-0 translate-middles badge rounded-pill bg-danger" >{source}</span>
        <img src={!imageUrl?"https://feeds.abplive.com/onecms/images/uploaded-images/2024/06/03/efcffbb9907bb95d40e611cfb46495aa1717409141785555_original.png?impolicy=abp_cdn&imwidth=1200":imageUrl} className="card-img-top" alt="..."/>
        <div className="card-body">
            <h5 className="card-title">{title} </h5>
            <p className="card-text">{description}</p>
            <p className="card-text"><small className="text-muted">By {!author?"Unknown":author} on {new Date(date).toGMTString()}</small></p>
            <a rel="norefferer" href={newsUrl} target="blank" className="btn btn-sm btn-dark">Read More</a>
        </div>
        </div>
      </div>
    )
  }
}
