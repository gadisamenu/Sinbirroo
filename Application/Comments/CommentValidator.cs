using Domain;
using FluentValidation;

namespace Application.Comments
{
    public class CommentValidator:AbstractValidator<Comment>
    {
        
        public CommentValidator()
        {
            RuleFor(x=> x.Body).NotEmpty().NotNull();
            RuleFor(x=> x.Activity).NotEmpty().NotNull();            
        }
    }
}