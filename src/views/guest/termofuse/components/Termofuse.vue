<template>
  <section>
    <v-container>
      <v-row justify="center" align="center" class="mt-15">
        <h1 class="black--text display-1 ml-0 mb-5 title">
          Quy chế hoạt động sàn giao dịch vận tải CRuM
        </h1>
      </v-row>
      <div class="line"></div>
      <v-row justify="center">
        <h4 class="black--text subheading ml-0 ma-3">
          V1.0 - Áp dụng từ ngày 21 tháng 08 năm 2020
        </h4></v-row
      >
      <p class="mt-15">
        <a @click="introduction = !introduction"
          >I. GIỚI THIỆU VỀ SÀN GIAO DỊCH VẬN TẢI CRuM</a
        >
      </p>
      <div class="mt-10" v-if="introduction">
        <p>
          Sàn giao dịch vận tải <strong>CRuM</strong> là Website trực tuyến
          <strong>môi giới - kết nối và hỗ trợ thực hiện giao dịch</strong> giữa
          đơn vị vận tải (chủ xe vận chuyển hàng hóa) với nhau và với các đơn vị
          chủ hàng (có hàng hóa cần vận chuyển).
        </p>
        <p>
          Sàn giao dịch vận tải <strong>CRuM</strong> hay do
          <strong>nhóm đồ án đại học FPT</strong> thiết kế, điều hành và khai
          thác.
        </p>
      </div>
      <p class="mt-15"><a @click="rule = !rule">II. NGUYÊN TẮC HOẠT ĐỘNG</a></p>
      <div v-if="rule" class="mt-10">
        <p>
          1- <strong>CRuM</strong> cung cấp công cụ để Chủ xe (Đơn vị vận tải )
          và Chủ hàng (Đơn vị có hàng hóa cần vận chuyển) thực việc đăng ký
          thông tin giao dịch, bao gồm:
        </p>
        <p class="ml-15">+ Đăng ký có xe chở hàng, chở khách;</p>
        <p class="ml-15">
          + Đăng ký nhu cầu vận tải hàng hóa, vận tải hành khách;
        </p>
        <p class="ml-15">+ Tìm kiếm nhu cầu vận tải hành khách;</p>
        <p class="ml-15">+ Tổ chức đấu thầu vận tải;</p>
        <p>
          2- Nội dung đăng ký sẽ được đánh mã số và được thông báo trên hệ thống
          <strong>CRuM</strong>.
        </p>
        <p>
          3- Đơn vị vận tải và Chủ hàng sẽ liên hệ với nhau thông qua thông tin
          do hệ thống CRuM cung cấp. Sàn giao dịch vận tải CRuM sẽ làm trung
          gian kiểm chứng thông tin của các bên và phối hợp thực hiện hợp đồng
          vận tải thông qua 1 hình thức: <strong>Hỗ trợ</strong> Đơn vị vận tải
          và Chủ hàng <strong>tải lên và xác thực hợp đồng</strong> tại trang
          web trước khi giao dịch với nhau. Hợp đồng sẽ đóng vai trò
          <strong>bằng chứng pháp lý</strong> của cả 2 bên.
        </p>
        <p>
          - Hàng hóa đăng ký giao dịch trên <strong>Sàn CRuM</strong> phải tuân
          thủ theo quy định của pháp luật Việt Nam. Chủ hàng phải hoàn toàn chịu
          trách nhiệm nếu đăng tin hàng hóa sai với thực tế hoặc hàng hóa không
          được phép giao dịch.
        </p>
        <p>
          - Thông tin xe và hàng hóa đăng trên hệ thống
          <strong>CRuM</strong> được thực hiện công khai, minh bạch, đảm bảo
          quyền lợi của các bên có liên quan.
        </p>
        <p>
          - Đơn vị vận tải, Chủ hàng và cá nhân người sử dụng khác cần phải đăng
          ký là Thành viên của Sàn giao dịch vận tải trước khi thực hiện bất kỳ
          giao dịch nào trên hệ thống <strong>CRuM</strong>. Việc đăng ký thành
          viên được thực hiện tự động thông qua việc điền form đăng ký của người
          đăng ký. Tuy vậy, người đăng ký chỉ được xem là Thành viên sau khi Sàn
          giao dịch vận tải <strong>CRuM</strong> xác thực thông tin. Thành viên
          tự chịu trách nhiệm bảo vệ mật khẩu và tính chính xác trong việc cung
          cấp thông tin cho Sàn giao dịch vận tải <strong>CRuM</strong>.
        </p>
        <p>
          - Bằng việc đăng ký thành viên của Sàn giao dịch vận tải
          <strong>CRuM</strong>, Đơn vị vận tải, Chủ xe và cá nhân đăng ký đã
          đồng ý với các điều khoản của Quy chế Sàn giao dịch vận tải
          <strong>CRuM</strong>.
        </p>
      </div>
      <p class="mt-15"><a @click="common = !common">III. QUY ĐỊNH CHUNG</a></p>
      <div class="mt-10" v-if="common">
        <p>
          - Tên gọi: <strong>CRuM</strong> hay Sàn giao dịch vận tải CRuM nói
          đến sàn Thương mại điện tử với hệ thống <strong>CRuM</strong>.
        </p>
        <p>
          - <strong>Chủ hàng</strong>:là tổ chức hoặc cá nhân thuê đơn vị kinh
          doanh vận tải vận chuyển hàng hóa bằng xe ô tô trên đường bộ.
        </p>
        <p>
          - <strong>Chủ xe</strong>: là tổ chức hoặc cá nhân sử dụng xe ô tô để
          vận tải hàng hóa trên đường bộ.
        </p>
        <p>
          - <strong>Khách vãng lai</strong>: là người tham gia Sàn CRuM nhưng
          không tham gia giao dịch, đăng tin.
        </p>
        <p>
          - <strong>Hàng hóa</strong>: là các loại hàng của Chủ hàng cần vận
          chuyển.
          <span
            >Sàn CRuM không tham gia kinh doanh, không cung cấp công cụ mua bán
            hàng hóa trên hệ thống CRuM.</span
          >
        </p>
        <p>
          - <strong>Giao dịch thầu kín</strong>: là giao dịch đề xuất giá 1
          chiều,không có sự thương lượng giữa hai bên Chủ xe - Chủ hàng trước
          khi mở thầu. Giá bỏ thầu được giữ kín đến khi mở thầu. Khi đến thời
          điểm mở thầu người bỏ thầu không có quyền điều chỉnh giá bỏ thầu trước
          khi ngày hết hiệu lực mời thầu. Chủ hàng hoặc Quản trị Sàn CRuM sẽ
          công bố người thắng thầu dựa trên danh sách giá bỏ thầu của các thành
          viên.
        </p>
      </div>
      <p class="mt-15">
        <a @click="procedure = !procedure">IV. QUY TRÌNH GIAO DỊCH</a>
      </p>
      <div class="mt-10" v-if="procedure">
        <p class="mt-10 ml-5">
          <a @click="post = !post">
            IV.1 Quy trình đăng tin mua/bán dịch vụ vận tải</a
          >
        </p>
        <div class="mt-8 ml-5" v-if="post">
          <p>
            - Khi Chủ xe (Đơn vị vận tải) hoặc Chủ hàng có nhu cầu đăng tin
            mua/bán dịch vụ sẽ thực hiện theo các bước thứ tự như sau:
          </p>
          <p>
            + Bước 1: Đăng vào website CRuM (phải đăng ký là thành viên trước và
            được xác thực).
          </p>
          <p>
            + Bước 2: Thành viên chọn vào mục đăng tin (<strong
              >Hàng xuất</strong
            >
            => <strong>Thêm mới Hàng xuất</strong> với thành viên
            <strong>Chủ hàng</strong>, <strong>Hàng nhập</strong> =>
            <strong>Thêm mới Hàng nhập</strong> đối với thành viên
            <strong>Chủ xe</strong>).
          </p>
          <p>+ Bước 3: Thành viên điền các thông tin cần đăng tải.</p>
          <p>+ Bước 4: Thành viên bấm nút <strong>Thêm mới</strong>.</p>
        </div>
        <p class="mt-10 ml-5">
          <a @click="deal = !deal"
            >IV.2 Quy trình giao dịch mua/bán dịch vụ vận tải</a
          >
        </p>
        <div class="mt-8 ml-5" v-if="deal">
          <p>
            - Khi Chủ xe (Đơn vị vận tải) hoặc Chủ hàng có nhu cầu giao dịch sẽ
            thực hiện theo các bước thứ tự như sau:
          </p>
          <p>
            + Bước 1: <strong>Chủ hàng</strong> thêm mới một
            <strong>Hồ sơ mời thầu</strong> từ <strong>Hàng xuất</strong> muốn
            giao dịch.
          </p>
          <p>
            + Bước 2: <strong>Hồ sơ mời thầu</strong> được gửi đi và thông báo
            đến những <strong>Chủ xe</strong> có <strong>Hàng nhập</strong> phù
            hợp. <strong>Chủ xe</strong> cũng có thể tìm kiếm những
            <strong>Hồ sơ mời thầu</strong> phù hợp và gửi đi
            <strong>Hồ sơ dự thầu</strong>.
          </p>
          <p>
            + Bước 3: Đọc kỹ thông tin về Hồ sơ mời thầu, Hồ sơ dự thầu, xe,
            hàng hóa cần vận chuyển thông qua thông tin trên hệ thống CRuM.
          </p>
          <p>
            + Bước 4: <strong>Chủ hàng</strong> nhận danh sách
            <strong>Hồ sơ dự thầu</strong>, chọn
            <strong>Hồ sơ dự thầu</strong> phù hợp và tạo
            <strong>Hàng ghép</strong>.
          </p>
          <p>
            + Bước 5: <strong>Chủ hàng</strong> gửi yêu cầu về hợp đồng đến
            <strong>Chủ xe</strong> (nếu có).
          </p>
          <p>
            + Bước 6: (ngoài sàn) Triển khai hợp đồng vận tải, thanh toán và
            theo dõi quá trình vận chuyển hàng hóa(hiện tại bước này nằm ngoài
            phạm vi của hệ thống CRuM). Sàn giao dịch vận tải CRuM có thể cung
            cấp
            <strong>dịch vụ bảo hiểm</strong> và
            <strong>giám sát quá trình vận tải hàng hóa</strong> nếu các bên có
            nhu cầu.
          </p>
          <p>
            + Bước 7: <strong>Chủ xe</strong> tải lên file hợp đồng và chờ
            <strong>Chủ hàng</strong> chấp nhận. Khi
            <strong>Chủ hàng</strong> chấp nhận hợp đồng, quá trình vận tải
            chính thức diễn ra.
          </p>
          <p>
            + Bước 8: (ngoài sàn) Đơn vị vận tải vận chuyển hàng hóa đến nơi quy
            định, bàn giao đúng số lượng hàng hóa cho chủ hàng. Các bên thực
            hiện thanh toán theo hợp đồng đã ký.
          </p>
          <p>
            + Bước 9: (ngoài sàn) Hai bên thanh toán tiền qua hình thức
            <strong>chuyển khoản</strong> theo giá hợp đồng.
          </p>
          <p>
            + Bước 10: Tạo <strong>Hóa đơn</strong> cho số tiền chuyển khoản và
            đợi đối tác xác nhận.
          </p>
          <p>
            + Bước 11: Cả 2 bên xác nhận đã thanh toán xong. Giao dịch hoàn tất.
          </p>
          <p>
            * Khi có bất cứ sự cố nào xảy ra trong quá trình giao dịch – Sàn
            giao dịch vận tải CRuM sẽ tiếp nhận phản hồi của các bên về việc
            thực hiện giao dịch, tùy theo tình huống, Sàn CRuM sẽ tham gia giải
            quyết cùng các bên trên tinh thần Hợp đồng đã ký.
          </p>
        </div>
        <p class="mt-10 ml-5">
          <a @click="bid = !bid">IV.3 Quy trình Đấu thầu vận tải hàng hóa</a>
        </p>
        <div class="mt-8 ml-5" v-if="bid">
          <p>
            1- Sàn giao dịch <strong>CRuM</strong> cung cấp dịch vụ đấu thầu vận
            tải hàng hoá theo hình thức: Chủ hàng tổ chức đấu thầu.
          </p>
          <p>
            2- Khi Chủ hàng tổ chức đấu thầu, các bên tham gia thầu phải tuân
            thủ các quy định do Sàn <strong>CRuM</strong> áp dụng tại thời điểm
            đấu thầu đối với thành viên tham gia.
          </p>
          <p>
            3- Thành viên tham gia đấu thầu nghiêm túc thực hiện các yêu cầu của
            Sàn
            <strong>CRuM</strong> khi tham gia đấu thầu, nếu đấu thầu thắng phải
            thực hiện nghĩa vụ được quy định tại bảng nội quy tham gia thầu được
            công bố trước đó.
          </p>
        </div>
        <p class="mt-10 ml-5">
          <a @click="join = !join">IV.4. Hướng dẫn tham gia đấu thầu</a>
        </p>
        <div class="mt-8 ml-5" v-if="join">
          <p>
            Việc tham gia đấu thầu chỉ dành riêng cho các Thành viên Sàn giao
            dịch vận tải <strong>CRuM</strong>.
          </p>
          <p>
            1- Thành viên tham dự thầu, sau khi đã hoàn thành nghĩa vụ tài chính
            theo quy định sẽ tiến hành thực hiện chào giá cước vận tải thông qua
            công cụ Liên hệ trên hệ thống CRuM, thông tin này sẽ được gửi đến
            Ban quản trị Sàn giao dịch vận tải <strong>CRuM</strong>.
          </p>
          <p>
            2- Khi đến hạn mở thầu, Ban quản trị Sàn giao dịch vận tải
            <strong>CRuM</strong> sẽ thống kê giá dự thầu của các thành viên,
            liệt kê thành viên dự thầu thỏa mãn các điều kiện năng lực thực hiện
            hợp đồng cũng như các điều kiện thương mại khác. Thành viên trúng
            thầu là thành viên được cho là đủ năng lực thực hiện hợp đồng và đưa
            ra giá dự thầu thấp nhất, các điều kiện thương mại có lợi nhất cho
            Bên mời thầu.
          </p>
          <p>
            3- Đơn vị trúng thầu sẽ được Sàn giao dịch vận tải
            <strong>CRuM</strong> gửi thông báo để tiến hành thương thảo ký hợp
            đồng trực tiếp với Chủ hàng mời thầu.
          </p>
          <p>
            4- Chủ hàng mời thầu không phải đặt cọc, nhưng sẽ phải đồng ý trong
            hợp đồng một khoản tiền phạt theo tỷ lệ % cước phí vận tải lô hàng
            nếu phá hợp đồng. Tỷ lệ % cụ thể sẽ được thống nhất giữa Chủ hàng và
            Chủ xe trước khi hoàn thiện Hợp đồng. Nếu sau khi cả hai bên đã hình
            thành hợp đồng mà một bên hủy hợp đồng, thì bên đó phải chịu phạt số
            tiền đã đăng ký trong hợp đồng. Khoản tiền này sẽ được xem như khoản
            tiền bồi hoàn hủy hợp đồng.
          </p>
        </div>
        <p class="mt-10 ml-5">
          <a @click="dispute = !dispute"
            >IV.5.Quy trình giải quyết tranh chấp, khiếu nại</a
          >
        </p>
        <div class="mt-8 ml-5" v-if="dispute">
          <p>
            Người sử dụng phần mềm hệ thống CRuM hoặc giao dịch tại hệ thống
            CRuM khi cần giải quyết tranh chấp - khiếu nại trong khi đấu thấu,
            thực hiện các bước sau:
          </p>
          <p>
            Bước 1: Tạo Report từ Hồ sơ mời thầu và gửi đến Quản trị viên hệ
            thống
            <strong>CRuM</strong>.
          </p>
          <p>
            Bước 2: <strong>CRuM</strong> sẽ xem xét và phản hồi trong vòng tối
            đa 30 ngày. Nếu sự việc không nằm trong phạm vi giải quyết của Sàn
            <strong>CRuM</strong>, Sàn <strong>CRuM</strong> sẽ chuyển sự việc
            sang đơn vị có liên quan giải quyết.
          </p>
        </div>
      </div>
      <p class="mt-15">
        <a @click="payment = !payment">V. QUY TRÌNH THANH TOÁN</a>
      </p>
      <div class="mt-10" v-if="payment">
        <p>
          - Việc thanh toán giữa chủ xe va chủ hàng được thực hiên theo từng hợp
          đồng vận tải cụ thể.
        </p>
        <p>
          - Trường hợp Sàn CRuM nhận ủy quyền ký hợp đồng với Chủ xe và Chủ
          hàng, việc thanh toán cũng sẽ tuân theo hợp đòng kinh tế đã ký.
        </p>
        <p>
          - Thời điểm hiện tại, CRuM chưa tích hợp công cụ thanh toán trực tuyến
          Internet banking, nên việc thanh toán với Sàn CRuM sẽ hầu hết qua
          chuyển khoản.
        </p>
      </div>
      <p class="mt-15">
        <a @click="trans_security = !trans_security"
          >VI. BẢO ĐẢM AN TOÀN GIAO DỊCH</a
        >
      </p>
      <div class="mt-10" v-if="trans_security">
        <p>
          1- Sàn giao dịch vận tải CRuM chịu trách nhiệm kiểm tra xác thực thông
          tin thành viên tham gia giao dịch, nhằm đảm bảo tất cả các thông tin
          giao dịch được công bố là chinh xác nhất có thể. Tuy vậy, Sàn CRuM
          không chịu trách nhiệm về những thông tin cung cấp không chính xác của
          các thanh viên.
        </p>
        <p>
          2- Tất cả các giao dịch của khách hàng đều được xử lý, giám sát đầy
          đủ, có thông báo xác thực cho thành viên liên quan ở từng giai đoạn.
        </p>
      </div>
      <p class="mt-15">
        <a @click="user_security = !user_security"
          >VII. BẢO VỆ THÔNG TIN CÁ NHÂN THÀNH VIÊN</a
        >
      </p>
      <div class="mt-10" v-if="user_security">
        <p>
          1- Sàn giao dịch vận tải CRuM cam kết bảo mật thông tin của thành viên
          tuyệt đối.
        </p>
        <p>
          2- Việc thu thập và sử dụng thông tin của mỗi thành viên chỉ được thực
          hiện khi có sự đồng ý của thành viên ngoại trừ những trường hợp pháp
          luật có quy định khác.
        </p>
        <p>
          3- Sàn giao dịch vận tải CRuM chỉ cung cấp thông tin khách hàng cho
          bên thứ ba nếu có sự đồng ý của thành viên hoặc theo yêu cầu của cơ
          quan nhà nước theo quy định của pháp luật.
        </p>
      </div>
      <p class="mt-15">
        <a @click="bad = !bad">VIII. QUẢN LÝ THÔNG TIN XẤU</a>
      </p>
      <div class="mt-10" v-if="bad">
        <p>
          - Thông tin đăng ký Hàng xuất của Chủ hàng phải thể hiện tính trung
          thực.
        </p>
        <p>
          - Hàng hóa vận tải phải là hàng hóa được phép vận chuyển. Nếu là hàng
          quá khổ - quá tải Chủ hàng phải thông báo rõ tại mục Mô tả khi đăng
          ký. Nếu là hóa cần có giấy phép vận chuyển, thành viên phải cung cấp
          thông tin giấy phép liên quan.
        </p>
        <p>
          - Đối với thành viên Chủ xe, cam kết không vận chuyển hàng quá khổ -
          quá tải khi chưa được sự cho phép của cơ quan chức năng. Trương hợp
          hàng hóa cần giấy phép vận chuyển, Thành viên Chủ xe phải tuân thủ quy
          định xin cấp phép trước khi vận chuyển.
        </p>
        <p>
          - Sàn CRuM không giữ quyền kiểm duyệt nội dung thông tin đăng tải của
          thành viên, và không chịu trách nhiệm pháp lý với những sai phạm của
          thành viên. Thành viên đăng nếu có sai phạm đến pháp luật phải chịu
          toàn bộ trách nhiệm với pháp luật.
        </p>
      </div>
      <p class="mt-15">
        <a @click="responsibility = !responsibility">
          IX. TRÁCH NHIỆM CỦA SÀN CRuM KHI XẢY RA LỖI KỸ THUẬT
        </a>
      </p>
      <div class="mt-10" v-if="responsibility">
        <p>
          - Sàn CRuM chịu trách nhiệm vận hành máy chủ và phần mềm Sàn giao dịch
          vận tải CRuM hoạt động thông suốt 24/24.
        </p>
        <p>
          - Sàn CRuM luôn đầu tư nâng cấp máy chủ hiện đại, cơ chế sao lưu dữ
          liệu tự động, an toàn.
        </p>
        <p>
          - Sàn CRuM chịu trách nhiệm bảo quản thông tin giao dịch của các thành
          viên, có chế độ sao lưu định kỳ.
        </p>
        <p>
          - Trong trường hợp rủi ro do sự cố kỹ thuật làm gián đoạn giao dịch
          của thành viên, hoặc làm mất dữ liệu của thành viên, Sàn CRuM sẽ cố
          gắng tối đa khôi phục hoạt động hệ thống CRuM trong thời gian sớm nhất
          có thể. Sàn CRuM cam kết thời gian gián đoạn do lỗi máy chủ sẽ không
          vượt quá 24 giờ/ năm.
        </p>
        <p>
          - Đối với phần dữ liệu bị mất không thể khôi phục lại được, Sàn CRuM
          mong thành viên thông cảm và Sàn CRuM không chịu trách nhiệm liên đới
          phát sinh do việc mất mát dữ liệu gây ra. Tuy nhiên Sàn CRuM sẽ xác
          nhận trung thực việc mất dữ liệu là do lỗi kỹ thuật cho các bên nếu có
          yêu cầu.
        </p>
      </div>
      <p class="mt-15">
        <a @click="user = !user">
          X. QUYỀN VÀ TRÁCH NHIỆM CỦA THÀNH VIÊN THAM GIA SÀN GIAO DỊCH VẬN TẢI
          CRuM
        </a>
      </p>
      <div class="mt-10" v-if="user">
        <p class="highlight">
          1. Quyền của thành viên tham gia Sàn Giao dịch vận tải CRuM - Được
          tham gia sử dụng dịch vụ do Sàn giao dịch vận tải CRuM cung cấp
        </p>
        <p>
          - Được quyền liên lạc với các bộ phận hỗ trợ của Sàn giao dịch vận tải
          <strong>CRuM</strong> khi sử dụng dịch vụ, trước và sau khi giao dịch.
        </p>
        <p>
          - Được quyền cung cấp các thông tin cơ bản liên quan đến giao dịch:
          loại xe, loại hàng, tổng giá trị giao dịch, thời gian vận chuyển…
        </p>
        <p>
          - Được bảo vệ thông tin cá nhân tuyệt đối nói tại điều III, và nếu Sàn
          Giao dịch vận tải <strong>CRuM</strong> cung cấp thông tin thành viên
          cho bên thứ 3 phải có sự cho phép của thành viên, ngoại trừ các trường
          hợp theo yêu cầu của cơ quan chức năng.
        </p>
        <p>
          - Được tham gia các chương trình khuyến mãi, quay số trúng thưởng, ưu
          đãi khách hàng nếu đáp ứng được quy chế chương trình do Sàn
          <strong>CRuM</strong> ban hành.
        </p>
        <p>
          - Được quyền đề nghị Sàn <strong>CRuM</strong> trả lời thắc mắc, khiếu
          nại. Địa chỉ tiếp nhận:
        </p>
        <p class="ml-15">
          Email: support@containerrounduse.com
        </p>
        <p class="ml-15">Địa chỉ: Thạch Hòa- Thạch Thất- Hà Nội</p>
        <p class="ml-15">Tel/Fax: <strong>035 904 9292</strong></p>
        <p class="highlight">2. Trách nhiệm của thành viên tham gia Sàn CRuM</p>
        <p>
          - Tuân thủ quy chế hoạt động, chính sách do Sàn
          <strong>CRuM</strong> ban hành.
        </p>
        <p>
          - Đọc kỹ các thông tin về mô tả về xe của Chủ xe và hàng hóa của Chủ
          hàng trước khi thực hiện giao dịch.
        </p>
        <p>
          - Chịu trách nhiệm về các thông tin cung cấp cho Sàn giao dịch vận tải
          <strong>CRuM</strong> là đúng và xác thực.
        </p>
        <p>
          - Chịu trách nhiệm bảo mật tài khoản đăng nhập hệ thống CRuM của mình
          ở Sàn giao dịch vận tải <strong>CRuM</strong>.
        </p>
        <p class="highlight">
          3. Quy định đối với người tham gia Sàn Giao dịch vận tải CRuM
        </p>
        <p>
          - Tuân thủ quy chế hoạt động, chính sách do Sàn
          <strong>CRuM</strong> ban hành.
        </p>
        <p>
          - Kê khai đầy đủ thông tin cá nhân bằng tiếng Việt có dấu: Họ và tên
          đầy đủ, địa chỉ nhận hàng (khu phố, phường, quận, thành phố).
        </p>
        <p>- Kê khai email và số điện thoại có thể liên lạc được.</p>
        <p>
          - Khi gửi Phản hồi và Liên hệ tới Ban quản trị Sàn giao dịch vận tải
          <strong>CRuM</strong>, thành viên cần gửi bằng Tiếng Việt có dấu, hoặc
          Tiếng Anh.
        </p>
        <p>
          - Không gửi những nội dung mang tính chất phá hoại, sỉ nhục hay những
          nội dung vi phạm quy định thuần phong mỹ tục của pháp luật Việt Nam.
        </p>
        <p>
          - Khi tham gia đấu thầu trên Sàn <strong>CRuM</strong>, thành viên cần
          tuân theo đúng các quy định, quy trình về đấu thầu được thể hiện tại
          bản nội quy tham gia thầu.
        </p>
      </div>
      <p class="mt-15">
        <a @click="crum = !crum">
          XI. QUYỀN VÀ TRÁCH NHIỆM CỦA SÀN GIAO DỊCH VẬN TẢI CRuM
        </a>
      </p>
      <div class="mt-10" v-if="crum">
        <p class="highlight">1. Quyền của Sàn giao dịch vận tải CRuM</p>
        <p class="ml-15">
          a- Sàn <strong>CRuM</strong> có quyền từ chối những giao dịch vi phạm
          pháp luật Việt Nam và luật thương mại quốc tế.
        </p>
        <p class="ml-15">
          b- Sàn <strong>CRuM</strong> có quyền từ chối những giao dịch đi ngược
          lại thuần phong mỹ tục Việt Nam.
        </p>
        <p class="ml-15">
          c- Sàn <strong>CRuM</strong> có quyền từ chối hỗ trợ khiếu nại nếu lỗi
          thuộc về thành viên không đọc kỹ các thông tin xe hoặc hàng hóa của
          đối tác.
        </p>
        <p class="ml-15">
          d- Sàn <strong>CRuM</strong> có quyền thay đổi các chính sách liên
          quan và sẽ có hiệu lực sau 30 ngày kể từ ngày thông báo.
        </p>
        <p class="ml-15">
          e- Sàn <strong>CRuM</strong> có quyền khóa các tài khoản đăng nhập
          thành viên nếu thành viên vi phạm các chính sách hoạt động của Sàn.
        </p>
        <p class="highlight">2. Trách nhiệm của Sàn giao dịch vận tải CRuM</p>
        <p class="ml-15">
          a- Sàn Giao dịch vận tải <strong>CRuM</strong> có trách nhiệm kết nối
          các dữ liệu thông tin về xe và hàng hóa trên các website giao dịch vận
          tải khác.
        </p>
        <p class="ml-15">
          b- Sàn Giao dich vận tải <strong>CRuM</strong> sẽ cố gắng hết sức để
          khắc phục nếu có sự cố xảy ra như mất điện, hỏa hoạn, thiên tai ảnh
          hưởng đến quyền lợi của thành viên. Tuy nhiên nếu những sự cố khách
          quan này xảy ra nằm ngoài kiểm soát của Sàn Giao dịch vận tải
          <strong>CRuM</strong> gây thiệt hại đến Thành viên thì Sàn CRuM sẽ
          không liên đới chịu trách nhiệm.
        </p>
        <p class="ml-15">
          c- Giải quyết - trả lời thắc mắc - khiếu nại của thành viên khi nhận
          được thông qua email tại địa chỉ: support@containerrounduse.com. Tùy
          theo mức độ phức tạp của thắc mắc, khiếu nại của thành viên, Sàn
          <strong>CRuM</strong> sẽ phản hồi người gửi trong vòng tối đa 30 ngày
          làm việc.
        </p>
        <p>
          Trong trường hợp khiếu nại nằm ngoài khả năng và thẩm quyền của Sàn
          <strong>CRuM</strong>
          thì Ban quản trị sẽ yêu cầu bên khiếu nại đưa vụ việc này ra cơ quan
          nhà nước có thẩm quyền giải quyết theo pháp luật
        </p>
      </div>
      <p class="mt-15">
        <a @click="apply = !apply">XII. ĐIỀU KHOẢN ÁP DỤNG</a>
      </p>
      <div class="mt-10" v-if="apply">
        <p>
          - Quy chế hoạt động của Sàn Giao dịch vận tải <strong>CRuM</strong> có
          hiệu lực chính thức kể từ ngày đăng lên hệ thống
          <strong>CRuM</strong>. Sàn <strong>CRuM</strong> có quyền điều chỉnh,
          thay đổi, bổ sung các điều khoản của Quy chế này cho phù hợp với thực
          tiễn hoạt động và có trách nhiệm thông báo lên hệ thống
          <strong>CRuM</strong> cho các thành viên biết. Quy chế sửa đổi có hiệu
          lực sau 30 ngày kể từ ngày có thông báo sửa đổi.
        </p>
        <p>
          - Sàn Giao dịch vận tải <strong>CRuM</strong> và Thành viên đồng ý cam
          kết thực hiện đúng các điều khoản trong nội dung Quy chế hoạt động
          này. Mọi tranh chấp phát sinh đều giải quyết trên cơ sở thương lượng,
          nếu một trong hai bên thấy không thỏa đáng, có thể đưa vụ việc lên tòa
          án kinh tế Thành phố Hà Nội giải quyết.
        </p>
      </div>
      <p class="mt-15">
        <a @click="commit = !commit">XIII. ĐIỀU KHOẢN CAM KẾT</a>
      </p>
      <div class="mt-10" v-if="commit">
        <p>Công ty Cổ phần Sàn giao dịch Vận tải CRuM</p>

        <p class="commit mb-10">(CRuM hoặc hệ thống CRuM)</p>

        <p>Địa chỉ: Thạch Hòa- Thạch Thất- Hà Nội</p>
        <p>
          Điện thoại liên hệ: 035 904 9292
        </p>
        <p>Hotline 0967.390.091</p>
        <p class="mb-10">Liên hệ: support@containerrounduse.com</p>
      </div>
      <v-row justify="center"> <p>ĐẠI DIỆN SÀN CRuM</p> </v-row
      ><v-row justify="center" class="mb-15"><p>Quản lý dự án</p></v-row>
      <v-row justify="center"><p>NGUYỄN VĂN AN</p></v-row>
    </v-container>
  </section>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Termofuse extends Vue {
  introduction = false;
  rule = false;
  common = false;
  procedure = false;
  post = false;
  deal = false;
  bid = false;
  join = false;
  dispute = false;
  payment = false;
  trans_security = false;
  user_security = false;
  bad = false;
  responsibility = false;
  user = false;
  crum = false;
  apply = false;
  commit = false;
}
</script>
<style scoped lang="css">
section {
  background-color: white !important;
}
.title {
  font-size: 45px !important;
  font-weight: bold;
}
.subheading {
  font-size: 15px !important;
  font-weight: 300;
  font-style: italic;
  color: red !important;
}
.line {
  content: "";
  margin-left: 320px;
  width: 40%;
  height: 4px;
  background: #eea632;
  display: block;
}
p span {
  font-weight: bold;
  text-decoration: underline;
}
.highlight {
  font-weight: bold;
  font-style: italic;
}
.commit {
  color: #037243 !important;
}
</style>
