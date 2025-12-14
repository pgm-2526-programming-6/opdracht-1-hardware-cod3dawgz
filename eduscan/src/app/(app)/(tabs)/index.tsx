import DefaultView from "@design/View/DefaultView";
import useUser from "@functional/auth/useUser";
import StudentQrCode from "@functional/qrcode/StudentQrCode";
import TeacherScanner from "@functional/qrcode/TeacherScanner";

export default function Homepage() {

  const user = useUser();

  return (
    <DefaultView>    
      
      {user.is_teacher ? <TeacherScanner teacherId={user.id} />: <StudentQrCode />}

    </DefaultView>


  );
}
