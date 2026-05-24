package wsb.edu.cybquiz.user.function;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import wsb.edu.cybquiz.user.dto.LoginRequestDto;
import wsb.edu.cybquiz.user.dto.LoginResponseDto;
import wsb.edu.cybquiz.user.service.UserService;

import java.util.function.Function;

@Component("auth/login")
@RequiredArgsConstructor
public class LoginFunction implements Function<LoginRequestDto, LoginResponseDto> {

    private final UserService userService;

    @Override
    public LoginResponseDto apply(LoginRequestDto dto) {
        return userService.login(dto);
    }
}