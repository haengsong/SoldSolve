package com.ssafy.soldsolve.api.controller;

import com.ssafy.soldsolve.api.request.NoticePostReq;
import com.ssafy.soldsolve.api.response.NoticeRes;
import com.ssafy.soldsolve.api.service.AdminService;
import com.ssafy.soldsolve.api.service.UserService;
import com.ssafy.soldsolve.common.model.response.BaseResponseBody;
import com.ssafy.soldsolve.db.entity.Notice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    UserService userService;

    @Autowired
    AdminService adminService;

    // 전체 유저 리스트
    @GetMapping("/user/{page}")
    public ResponseEntity<?> getUserList(@PathVariable int page) {
        return ResponseEntity.status(200).body(adminService.findAllUser(page));
    }

    // 유저 아이디로 유저 정지
    @PatchMapping("/user/{userId}")
    public ResponseEntity<? extends BaseResponseBody> suspendUser(@PathVariable int userId) {
        adminService.suspendUser(userId);
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }

    // 유저 아이디로 유저 삭제
    @DeleteMapping("/user/{userId}")
    public ResponseEntity<? extends BaseResponseBody> deleteUser(@PathVariable int userId) {
        adminService.deleteUser(userId);
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }

    // 공지 조회
    @GetMapping("/notice")
    public ResponseEntity<?> selectNotice(@RequestParam(name="page") int page) {
        return ResponseEntity.status(200).body(adminService.findAll(page));
    }

    // 특정 공지 조회
    @GetMapping("/notice/{noticeId}")
    public ResponseEntity<?> choiceNotice(@PathVariable int noticeId) {
        Notice notice = adminService.getNotice(noticeId);
        return ResponseEntity.status(200).body(NoticeRes.of(notice));
    }

    // 공지 생성. title과 content Json형태로 Body에 넣어주기.
    @PostMapping("/notice")
    public ResponseEntity<? extends BaseResponseBody> createNotice(@RequestBody NoticePostReq registerInfo) {
        adminService.createNotice(registerInfo);
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }

    // 공지 수정 // api/v1/notices/notice_id를 적으면 notice_id를 기준으로 수정 가능. title과 content Json형태로 Body
    @PatchMapping("/notice/{noticeId}")
    public ResponseEntity<?> updateNotice(
            @PathVariable int noticeId,
            @RequestBody NoticePostReq noticeInfo){
        adminService.updateNotice(noticeInfo,noticeId);
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }

    // 공지 삭제 // 마찬가지로 notice_id를 기준으로 삭제 가능.
    @DeleteMapping("/notice/{noticeId}")
    public ResponseEntity<?> deleteNotice(@PathVariable int noticeId){
        adminService.deleteNotice(noticeId);
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }
}
