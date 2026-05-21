package wsb.edu.cybquiz.user.mapper;

import org.springframework.stereotype.Component;
import wsb.edu.cybquiz.user.dto.UserDto;
import wsb.edu.cybquiz.user.model.UserEntity;

@Component
public class UserMapper {

    public UserDto toDto(UserEntity entity) {
        return UserDto.builder()
                .login(entity.getLogin())
                .password(entity.getPassword())
                .role(entity.getRole())
                .build();
    }

    public UserEntity toEntity(UserDto dto) {
        return UserEntity.builder()
                .login(dto.getLogin())
                .password(dto.getPassword())
                .role(dto.getRole())
                .build();
    }
}