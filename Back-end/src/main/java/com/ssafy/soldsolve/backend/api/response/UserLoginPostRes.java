package com.ssafy.soldsolve.backend.api.response;



import com.ssafy.soldsolve.backend.common.model.response.BaseResponseBody;

import lombok.Getter;
import lombok.Setter;

/**
 * 유저 로그인 API ([POST] /api/v1/auth) 요청에 대한 응답값 정의.
 */
@Getter
@Setter
//@ApiModel("UserLoginPostResponse")
public class UserLoginPostRes extends BaseResponseBody{
	//@ApiModelProperty(name="JWT 인증 토큰", example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN...")
	String accessToken;
	
	public static UserLoginPostRes of(Integer statusCode, String message, String accessToken) {
		UserLoginPostRes res = new UserLoginPostRes();
		res.setStatusCode(statusCode);
		res.setMessage(message);
		res.setAccessToken(accessToken);
		return res;
	}
}
