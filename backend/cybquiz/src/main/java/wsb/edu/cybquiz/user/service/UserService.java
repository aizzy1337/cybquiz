package wsb.edu.cybquiz.user.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import wsb.edu.cybquiz.user.dto.LoginRequestDto;
import wsb.edu.cybquiz.user.dto.LoginResponseDto;
import wsb.edu.cybquiz.user.dto.UserCreateResponseDto;
import wsb.edu.cybquiz.user.dto.UserResponseDto;
import wsb.edu.cybquiz.user.model.UserEntity;
import wsb.edu.cybquiz.user.repo.UserRepository;
import wsb.edu.cybquiz.user.dto.UserDto;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repo;

    public UserCreateResponseDto createUser(UserDto dto) {
        String id = UUID.randomUUID().toString();
        UserEntity entity = UserEntity.builder()
                .id(id)
                .login(dto.getLogin())
                .password(dto.getPassword())
                .role(dto.getRole())
                .build();
        repo.save(entity);

        return new UserCreateResponseDto(id);
    }

    public UserDto findById(String userId) {
        UserEntity entity = repo.findById(userId).orElseThrow();
        return new UserDto(entity.getLogin(), entity.getPassword(), entity.getRole());
    }

    public UserDto findByLogin(String login) {
        UserEntity entity = repo.findByLogin(login).orElseThrow();
        return new UserDto(entity.getLogin(), entity.getPassword(), entity.getRole());
    }

    public LoginResponseDto login(LoginRequestDto dto) {
        UserEntity user = repo.findByLogin(dto.login())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(dto.password())) {
            throw new RuntimeException("Invalid password");
        }

        return new LoginResponseDto(
                user.getId(),
                user.getLogin(),
                user.getRole()
        );
    }
    public List<UserDto> findAll() {
        return repo.findAll()
                .items()
                .stream()
                .map(e -> new UserDto(e.getLogin(), e.getPassword(), e.getRole()))
                .collect(Collectors.toList());
    }

    public List<UserResponseDto> findAllSafe() {
        return repo.findAll()
                .items()
                .stream()
                .map(e -> new UserResponseDto(e.getId(), e.getLogin(), e.getRole()))
                .collect(Collectors.toList());
    }
}